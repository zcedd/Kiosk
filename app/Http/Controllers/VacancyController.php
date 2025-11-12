<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use App\Models\Specialization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class VacancyController extends Controller
{
    public function index(Request $request)
    {

        $showCharter = $request->routeIs('vacancies.withcharter');
        $search = $request->input('search');
        $specializationsFilter = (array) $request->input('specializations', []);
        $jobType = $request->input('job_type');
        $salaryFrom = $request->input('salary_from');
        $salaryTo = $request->input('salary_to');
        $postedDate = $request->input('posted_date');

        // Load Specializations with their subSpecializations
        $specializations = Specialization::with('subSpecializations')->get()
            ->mapWithKeys(function($spec) {
                return [
                    $spec->name => $spec->subSpecializations->pluck('name', 'id')->toArray()
                ];
            });

        // Load Activities with associated companies
        $activities = DB::table('recruitment_activities')
            ->select(
                'recruitment_activities.id',
                'recruitment_activities.type',
                'recruitment_activities.start',
                'recruitment_activities.end',
                'recruitment_activities.venue',
                'recruitment_activities.details',
                DB::raw('GROUP_CONCAT(companies.name SEPARATOR ", ") as related_companies')
            )
            ->join(
                'company_recruitment_activity',
                'recruitment_activities.id',
                '=',
                'company_recruitment_activity.recruitment_activity_id'
            )
            ->join(
                'companies',
                'company_recruitment_activity.company_id',
                '=',
                'companies.id'
            )
            ->groupBy(
                'recruitment_activities.id',
                'recruitment_activities.type',
                'recruitment_activities.start',
                'recruitment_activities.end',
                'recruitment_activities.venue',
                'recruitment_activities.details'
            )
            ->orderBy('recruitment_activities.created_at', 'desc')
            ->limit(6)
            ->get();

        // Load Vacancies with filters
        $vacancies = Vacancy::with('company')
            ->when($search, function ($query, $search) {
                
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhereHas('company', fn($q2) => $q2->where('name', 'like', "%{$search}%"));
                });
            })
            ->when(!empty($specializationsFilter), fn($query) => $query->whereIn('sub_specialization_id', $specializationsFilter))
            ->when($jobType && $jobType !== 'All Types', function ($q) use ($jobType) {
                $normalized = strtolower(str_replace(['-', ' '], '', $jobType));
                $q->whereRaw("LOWER(REPLACE(REPLACE(job_type, '-', ''), ' ', '')) = ?", [$normalized]);
            })
            ->when($salaryFrom && $salaryFrom !== 'Any', function($q) use ($salaryFrom) {
                $amount = (int) filter_var($salaryFrom, FILTER_SANITIZE_NUMBER_INT);
                $q->where('salary_from', '>=', $amount);
            })
            ->when($salaryTo && $salaryTo !== 'Any', function($q) use ($salaryTo) {
                $amount = (int) filter_var($salaryTo, FILTER_SANITIZE_NUMBER_INT);
                $q->where('salary_to', '<=', $amount);
            })
            ->when($postedDate && $postedDate !== 'Anytime', function($q) use ($postedDate) {
                $days = match($postedDate) {
                    'Last 24 hours' => 1,
                    'Last 2 days'   => 2,
                    'Last 3 days'   => 3,
                    'Last 7 days'   => 7,
                    default         => null,
                };
                if ($days) $q->where('created_at', '>=', now()->subDays($days));
            })
            ->orderBy('created_at', 'desc')
            ->limit(18)
            ->get();

        return Inertia::render('VacancySearch', [
            'vacancies' => $vacancies,
            'activities' => $activities,
            'filters' => [
                'search' => $search,
                'specializations' => $specializationsFilter,
                'job_type' => $jobType,
                'salary_from' => $salaryFrom,
                'salary_to' => $salaryTo,
                'posted_date' => $postedDate,
            ],
            'specializations' => $specializations,
            'showCharter'  => $showCharter,
        ]);
    }
}
