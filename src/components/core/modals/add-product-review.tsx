import { Modal } from "@mantine/core";
import AddReviewForm from "../forms/add-review";
import { useSession } from "next-auth/react";
import LoginPromptModal from "./login-prompt";

interface AddProductReviewModalProps {
  open: boolean;
  onClose: () => void;
  productId: number;
}

const AddProductReviewModal: React.FC<AddProductReviewModalProps> = ({
  open,
  onClose,
  productId,
}) => {
  const { status } = useSession();

  return (
    <Modal opened={open} onClose={onClose} title="Add Product Review" centered>
      {status === "authenticated" ? (
        <AddReviewForm
          itemId={productId}
          closeModal={onClose}
          itemType="product"
        />
      ) : (
        <LoginPromptModal />
      )}
    </Modal>
  );
};

export default AddProductReviewModal;
