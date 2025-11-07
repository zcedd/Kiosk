import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import QRCode from "react-qr-code";
import Typography from "@mui/material/Typography";

export default function VacancyModal({ showQR, setShowQR, toTitleCase }) {
    const handleClose = () => setShowQR(null);

    React.useEffect(() => {
        if (showQR) {
            const scrollbarWidth =
                window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.paddingRight = "";
            document.body.style.overflow = "";
        }
    }, [showQR]);

    return (
        <Modal
            open={!!showQR}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{ backdrop: { timeout: 500 } }}
            disableScrollLock
        >
            <Fade in={!!showQR}>
                <Box
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
               bg-white border-4 border-[#074797] rounded-xl shadow-lg 
               max-w-[500px] w-[90%] max-h-[95vh] flex flex-col overflow-hidden"
                >
                    <div className="flex justify-between px-4 py-3   bg-white sticky top-0 z-10">
                        <Typography
                            variant="h6"
                            component="h2"
                            className="flex-1 pr-4 leading-snug"
                        >
                            <span className="uppercase text-[#084896]">
                                {showQR?.title}
                            </span>{" "}
                            <span className="text-[#084896]">
                                ({toTitleCase(showQR?.company?.name || "")})
                            </span>
                        </Typography>
                        <svg
                            fill="#074797"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            onClick={handleClose}
                            className="cursor-pointer hover:scale-110 transition self-start mt-1"
                        >
                            <path d="M4.293,18.293,10.586,12,4.293,5.707A1,1,0,0,1,5.707,4.293L12,10.586l6.293-6.293a1,1,0,1,1,1.414,1.414L13.414,12l6.293,6.293a1,1,0,1,1-1.414,1.414L12,13.414,5.707,19.707a1,1,0,0,1-1.414-1.414Z"></path>
                        </svg>
                    </div>

                    {/* Scrollable Content */}
                    <div
                        className="overflow-y-auto p-4"
                        style={{ maxHeight: "calc(95vh - 64px)" }}
                    >
                        {/* Details */}
                        <div
                            className="text-sm text-left text-gray-700 mb-4"
                            dangerouslySetInnerHTML={{
                                __html: showQR?.details,
                            }}
                        />

                        {/* QR Code */}
                        <div className="flex flex-col mt-10 items-center">
                            <QRCode
                                value={`https://workinilocosnorte.ph/jobs/search?vacancyId=${showQR?.id}`}
                                size={130}
                            />
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Scan the QR Code to apply or for more
                                information, please visit us at the <br />
                                <span className="font-semibold">
                                    Public Employment Services Office
                                </span>
                                <br />
                                West Wing, Capitol Building, Laoag City
                            </p>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
}
