import { Box, Modal, Typography } from "@mui/material"
import React from "react"
import { LiaTimesSolid } from "react-icons/lia"
import styles from "./modal.module.css"

interface LogoutModalProps {
  open: boolean
  handleClose: () => void
  handleConfirm: () => void
}

const CheckoutModal: React.FC<LogoutModalProps> = ({ open, handleClose, handleConfirm }) => {
  return (
    <Modal className={styles.modalOverlay} open={open} onClose={handleClose} aria-labelledby="logout-modal-title">
      <Box
        className={styles.deleteModalContent}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <div className="flex items-center justify-between">
          <Typography id="logout-modal-title" variant="h6" component="h2">
            Confirm Logout
          </Typography>
          <LiaTimesSolid className="cursor-pointer" onClick={handleClose} />
        </div>

        <Typography sx={{ mt: 2 }}>Are you sure you want to logout?</Typography>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <button className="button-danger h-[50px] w-full rounded-sm max-sm:h-[45px]" onClick={handleClose}>
            CANCEL
          </button>
          <button className="button-secondary h-[50px] w-full rounded-sm max-sm:h-[45px]" onClick={handleConfirm}>
            LOGOUT
          </button>
        </Box>
      </Box>
    </Modal>
  )
}

export default CheckoutModal
