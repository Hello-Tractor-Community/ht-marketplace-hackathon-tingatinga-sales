import { Modal } from "@mantine/core";
import AddReviewForm from "../forms/add-review";
import { useSession } from "next-auth/react";
import LoginPromptModal from "./login-prompt";

interface AddSellerReviewModalProps {
  open: boolean;
  onClose: () => void;
  sellerId: number;
}

const AddSellerReviewModal: React.FC<AddSellerReviewModalProps> = ({
  open,
  onClose,
  sellerId,
}) => {
  const { status } = useSession();

  return (
    <Modal opened={open} onClose={onClose} title="Add Seller Review" centered>
      {status === "authenticated" ? (
        <AddReviewForm
          itemId={sellerId}
          closeModal={onClose}
          itemType="seller"
        />
      ) : (
        <LoginPromptModal />
      )}
    </Modal>
  );
};

export default AddSellerReviewModal;
