import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const PaymentCancelledPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#101114] px-4 py-12 text-center font-inter text-[#e8e8eb]">
      <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-[#1a1b20] text-[#aaaab0]">
        <FiRefreshCw size={30} />
      </span>
      <h1 className="mt-6 text-3xl font-bold">Checkout cancelled</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#aaaab0]">
        Your payment was not completed. You can return to checkout and try again whenever you are
        ready.
      </p>
      <div className="mt-7 flex w-full max-w-sm gap-3">
        <button
          type="button"
          onClick={() => navigate(`/home/events/${id}/checkout`)}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#f20d22] py-3 text-xs font-bold transition hover:bg-[#f20d22]/90"
        >
          <FiRefreshCw /> Try Again
        </button>
        <button
          type="button"
          onClick={() => navigate(`/home/events/${id}`)}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-white/10 py-3 text-xs font-bold transition hover:bg-white/15"
        >
          <FiArrowLeft /> Back to Event
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelledPage;
