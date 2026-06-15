import React, { useState, useEffect } from "react";
import { X, CreditCard, QrCode, Smartphone, Landmark, CheckCircle, Loader2 } from "lucide-react";

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentDetails: { method: string; transactionId: string }) => void;
  amount: number;
  itemName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  gymName: string;
}

type PaymentMethod = "card" | "upi" | "qr" | "netbanking";

export function RazorpayModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  itemName,
  customerName,
  customerEmail,
  customerPhone,
  gymName,
}: RazorpayModalProps) {
  const [activeTab, setActiveTab] = useState<PaymentMethod>("card");
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [progress, setProgress] = useState(0);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState(customerName || "");

  // UPI fields
  const [upiId, setUpiId] = useState("");

  // Netbanking fields
  const [selectedBank, setSelectedBank] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartPayment = (methodName: string) => {
    setStatus("processing");
    setProgress(10);
    
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          setTimeout(() => {
            setStatus("success");
            setTimeout(() => {
              const mockTxn = "pay_" + Math.random().toString(36).substring(2, 12).toUpperCase();
              onSuccess({ method: methodName, transactionId: mockTxn });
              onClose();
            }, 1500);
          }, 600);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 150);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="relative w-full max-w-[420px] bg-[#1a1c24] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Top Branding Section */}
        <div className="bg-[#10121a] px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-lg border border-primary/30">
              {gymName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">{gymName}</h3>
              <p className="text-white/60 text-xs truncate max-w-[200px]">{itemName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">Amount to Pay</p>
            <p className="text-primary font-bold text-lg">₹{amount.toLocaleString()}</p>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="bg-[#171922] px-6 py-2 border-b border-white/5 flex justify-between items-center text-xs text-white/50">
          <span className="truncate max-w-[150px]">{customerEmail}</span>
          <span>{customerPhone}</span>
        </div>

        {status === "idle" && (
          <div className="flex min-h-[340px]">
            {/* Sidebar Methods Selection */}
            <div className="w-1/3 bg-[#13151c] border-r border-white/5 flex flex-col justify-start">
              <button
                onClick={() => setActiveTab("card")}
                className={`py-4 px-3 flex flex-col items-center justify-center gap-1.5 border-b border-white/5 text-center transition-all ${
                  activeTab === "card" ? "bg-[#1d202d] text-primary" : "text-white/60 hover:text-white"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-[10px] font-medium">Cards</span>
              </button>
              <button
                onClick={() => setActiveTab("upi")}
                className={`py-4 px-3 flex flex-col items-center justify-center gap-1.5 border-b border-white/5 text-center transition-all ${
                  activeTab === "upi" ? "bg-[#1d202d] text-primary" : "text-white/60 hover:text-white"
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-[10px] font-medium">UPI / GPay</span>
              </button>
              <button
                onClick={() => setActiveTab("qr")}
                className={`py-4 px-3 flex flex-col items-center justify-center gap-1.5 border-b border-white/5 text-center transition-all ${
                  activeTab === "qr" ? "bg-[#1d202d] text-primary" : "text-white/60 hover:text-white"
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-[10px] font-medium">QR Code</span>
              </button>
              <button
                onClick={() => setActiveTab("netbanking")}
                className={`py-4 px-3 flex flex-col items-center justify-center gap-1.5 border-b border-white/5 text-center transition-all ${
                  activeTab === "netbanking" ? "bg-[#1d202d] text-primary" : "text-white/60 hover:text-white"
                }`}
              >
                <Landmark className="w-5 h-5" />
                <span className="text-[10px] font-medium">Netbanking</span>
              </button>
            </div>

            {/* Methods Main Panel */}
            <div className="w-2/3 p-6 flex flex-col justify-between bg-[#1a1c24]">
              {activeTab === "card" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-white font-medium text-xs uppercase tracking-wider text-white/70">Card Payment</h4>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        className="w-full text-sm bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-white/50 block mb-1">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                          className="w-full text-sm bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/50 block mb-1">CVV</label>
                        <input
                          type="password"
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          maxLength={3}
                          className="w-full text-sm bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary text-center"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">Card Holder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full text-sm bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartPayment("Card")}
                    disabled={!cardNumber || !cardExpiry || !cardCvv}
                    className="w-full mt-2 bg-primary hover:bg-primary/90 disabled:bg-white/10 disabled:text-white/40 text-white font-medium text-xs py-2.5 rounded transition-all cursor-pointer"
                  >
                    Pay ₹{amount.toLocaleString()} Securely
                  </button>
                </div>
              )}

              {activeTab === "upi" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-white font-medium text-xs uppercase tracking-wider text-white/70">UPI Direct Pay</h4>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[10px] text-white/50 block mb-1">UPI ID / VPA</label>
                      <input
                        type="text"
                        placeholder="user@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full text-sm bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="text-[10px] text-white/40 mt-1">
                      Enter your UPI address linked to BHIM, Google Pay, PhonePe, or Paytm.
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartPayment("UPI")}
                    disabled={!upiId.includes("@")}
                    className="w-full mt-auto bg-primary hover:bg-primary/90 disabled:bg-white/10 disabled:text-white/40 text-white font-medium text-xs py-2.5 rounded transition-all cursor-pointer"
                  >
                    Pay ₹{amount.toLocaleString()}
                  </button>
                </div>
              )}

              {activeTab === "qr" && (
                <div className="flex flex-col items-center justify-between gap-3 text-center">
                  <h4 className="text-white font-medium text-xs uppercase tracking-wider text-white/70 self-start">Scan QR Code</h4>
                  
                  <div className="bg-white p-3 rounded-lg border border-white/10 w-[140px] h-[140px] flex items-center justify-center relative shadow-lg">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=demo@razorpay%26pn=${encodeURIComponent(gymName)}%26am=${amount}%26cu=INR`}
                      alt="Payment QR"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <p className="text-[10px] text-white/60">
                    Scan with BHIM, GPay, PhonePe, Paytm, or any banking app to complete payment.
                  </p>

                  <button
                    onClick={() => handleStartPayment("QR Code")}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium text-xs py-2 rounded transition-all cursor-pointer"
                  >
                    Simulate Scan & Pay Success
                  </button>
                </div>
              )}

              {activeTab === "netbanking" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-white font-medium text-xs uppercase tracking-wider text-white/70">Netbanking</h4>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] text-white/50 block mb-1">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full text-sm bg-[#13151c] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    >
                      <option value="">-- Choose Bank --</option>
                      <option value="SBI">State Bank of India (SBI)</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="AXIS">Axis Bank</option>
                      <option value="KOTAK">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleStartPayment(`NetBanking (${selectedBank})`)}
                    disabled={!selectedBank}
                    className="w-full mt-auto bg-primary hover:bg-primary/90 disabled:bg-white/10 disabled:text-white/40 text-white font-medium text-xs py-2.5 rounded transition-all cursor-pointer"
                  >
                    Proceed to Bank
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {status === "processing" && (
          <div className="flex flex-col items-center justify-center min-h-[340px] bg-[#1a1c24] p-6 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h4 className="text-white font-semibold text-base mb-1">Processing Payment</h4>
            <p className="text-white/60 text-xs mb-4">Please do not press back or refresh this window</p>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden max-w-[240px]">
              <div
                className="bg-primary h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center min-h-[340px] bg-[#1a1c24] p-6 text-center animate-scale-in">
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
            <h4 className="text-white font-semibold text-lg mb-1">Payment Successful!</h4>
            <p className="text-white/60 text-xs mb-1">Thank you for your payment.</p>
            <p className="text-[10px] text-white/40 bg-black/20 px-3 py-1 rounded-full border border-white/5 mt-2">
              Redirecting you to the portal...
            </p>
          </div>
        )}

        {/* Footer info branding */}
        <div className="bg-[#10121a] px-6 py-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
          <span>Secured by Razorpay</span>
          <button onClick={onClose} className="hover:text-white transition-all flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
