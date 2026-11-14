import { Trash2, AlertCircle } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2.5 rounded-lg ${destructive ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
            {destructive ? <Trash2 size={24} /> : <AlertCircle size={24} />}
          </div>
          <h3 className="text-lg font-bold text-charcoal">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 text-sm font-medium text-white rounded-xl transition-colors ${
              destructive ? "bg-red-600 hover:bg-red-700" : "bg-navy hover:bg-blue"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

export { ConfirmDialog };
