import React, { useMemo, useState } from "react";
import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  Clock3,
  AlertCircle,
  CalendarDays,
  Receipt,
  Eye,
  Printer,
  X,
  Download,
} from "lucide-react";

import { billingData, studentData } from "../../data/mockData";
import SectionHeader from "../../components/SectionHeader";
import { useLanguage } from "../../contexts/languageContext";
import { translate } from "../../utils/localization";

const Billing = () => {
  const language = useLanguage();
  const t = (value) => translate(language, value);
  // ---------------------------------------------------------
  // INITIAL BILLING DATA
  // ---------------------------------------------------------

  const initialFeeDetails = billingData?.feeDetails || [];

  const initialPaymentHistory = billingData?.paymentHistory || [];

  const [feeDetails, setFeeDetails] = useState(initialFeeDetails);

  const [paymentHistory, setPaymentHistory] = useState(
    initialPaymentHistory
  );

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // ---------------------------------------------------------
  // CALCULATE BILLING VALUES
  // ---------------------------------------------------------

  const totalFees = useMemo(() => {
    if (billingData?.totalFees !== undefined) {
      return Number(billingData.totalFees);
    }

    return feeDetails.reduce(
      (total, fee) => total + Number(fee.amount || 0),
      0
    );
  }, [feeDetails]);

  const paidAmount = useMemo(() => {
    return feeDetails.reduce(
      (total, fee) => total + Number(fee.paidAmount || 0),
      0
    );
  }, [feeDetails]);

  const dueAmount = Math.max(totalFees - paidAmount, 0);

  const paymentStatus =
    dueAmount === 0
      ? "Paid"
      : paidAmount > 0
      ? "Partially Paid"
      : "Pending";

  const dueDate = billingData?.dueDate || "10 Oct 2026";

  // ---------------------------------------------------------
  // FORMAT CURRENCY
  // ---------------------------------------------------------

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // ---------------------------------------------------------
  // PAYMENT HANDLER
  // ---------------------------------------------------------

  const handlePayment = () => {
    if (dueAmount <= 0) {
      alert("There are no pending fees to pay.");
      return;
    }

    const paymentAmount = dueAmount;

    const now = new Date();

    const formattedDate = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const transactionNumber = `AC${Date.now()}`;

    const receiptNumber = `REC-${now.getFullYear()}-${String(
      paymentHistory.length + 1
    ).padStart(3, "0")}`;

    // -------------------------------------------------------
    // UPDATE FEE DETAILS
    // -------------------------------------------------------

    let remainingPayment = paymentAmount;

    const updatedFees = feeDetails.map((fee) => {
      const feeAmount = Number(fee.amount || 0);
      const alreadyPaid = Number(fee.paidAmount || 0);

      const pendingForThisFee = Math.max(feeAmount - alreadyPaid, 0);

      if (remainingPayment <= 0 || pendingForThisFee <= 0) {
        return fee;
      }

      const amountToPay = Math.min(
        remainingPayment,
        pendingForThisFee
      );

      const newPaidAmount = alreadyPaid + amountToPay;

      remainingPayment -= amountToPay;

      return {
        ...fee,
        paidAmount: newPaidAmount,
        status:
          newPaidAmount >= feeAmount
            ? "Paid"
            : newPaidAmount > 0
            ? "Partially Paid"
            : "Pending",
      };
    });

    setFeeDetails(updatedFees);

    // -------------------------------------------------------
    // CREATE NEW PAYMENT RECORD
    // -------------------------------------------------------

    const newPayment = {
      id: `TXN${Date.now()}`,
      transactionId: transactionNumber,
      date: formattedDate,
      amount: paymentAmount,
      method: paymentMethod,
      status: "Paid",
      receiptNumber: receiptNumber,
      feeType: "Outstanding Fee Payment",
    };

    setPaymentHistory((previous) => [
      newPayment,
      ...previous,
    ]);

    // Close payment modal
    setShowPaymentModal(false);

    // Automatically show the newly generated receipt
    setSelectedReceipt(newPayment);
  };

  // ---------------------------------------------------------
  // PRINT RECEIPT
  // ---------------------------------------------------------

  const handlePrintReceipt = () => {
    if (!selectedReceipt) return;

    window.print();
  };

  // ---------------------------------------------------------
  // EMPTY STATE
  // ---------------------------------------------------------

  if (!billingData) {
    return (
      <div className="page-content">
        <SectionHeader
          title="Billing & Payments"
          subtitle="Manage your college fees and payment receipts"
        />

        <div className="billing-empty-state">
          <AlertCircle size={32} />
          <h3>{t("Billing information unavailable")}</h3>
          <p>
            {t("Billing information could not be loaded at the moment.")}
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------

  return (
    <div className="page-content">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <SectionHeader
        title="Billing & Payments"
        subtitle="Manage your college fees, payments and receipts"
      />

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="billing-summary-grid">

        {/* TOTAL FEES */}

        <div className="billing-summary-card">

          <div className="billing-summary-icon">
            <IndianRupee size={20} />
          </div>

          <div>
            <span>{t("Total Fees")}</span>

            <strong>
              {formatCurrency(totalFees)}
            </strong>
          </div>

        </div>

        {/* PAID */}

        <div className="billing-summary-card">

          <div className="billing-summary-icon success">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>{t("Paid Amount")}</span>

            <strong>
              {formatCurrency(paidAmount)}
            </strong>
          </div>

        </div>

        {/* DUE */}

        <div className="billing-summary-card">

          <div className="billing-summary-icon warning">
            <Clock3 size={20} />
          </div>

          <div>
            <span>{t("Due Amount")}</span>

            <strong>
              {formatCurrency(dueAmount)}
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================================
          OUTSTANDING PAYMENT CARD
      ====================================================== */}

      <div className="billing-due-card">

        <div className="billing-due-content">

          <div className="billing-due-icon">
            <CreditCard size={22} />
          </div>

          <div>

            <h3>
              {dueAmount > 0
                ? t("Outstanding Payment")
                : t("All Fees Paid")}
            </h3>

            <p>
              {dueAmount > 0
                ? `${t("Your outstanding amount is")} ${formatCurrency(
                    dueAmount
                  )}.`
                : t("You have no pending fee payments.")}
            </p>

            {dueAmount > 0 && (
              <div className="billing-due-date">
                <CalendarDays size={15} />
                {t("Due date:")} {dueDate}
              </div>
            )}

          </div>

        </div>

        {dueAmount > 0 && (
          <button
            type="button"
            className="primary-button billing-pay-button"
            onClick={() => setShowPaymentModal(true)}
          >
            <CreditCard size={17} />
            {t("Pay Now")}
          </button>
        )}

      </div>

      {/* =====================================================
          FEE BREAKDOWN
      ====================================================== */}

      <section className="dashboard-section">

        <SectionHeader
          title="Fee Breakdown"
          subtitle="Detailed view of your academic fees"
        />

        <div className="billing-table-wrapper">

          <table className="billing-table">

            <thead>

              <tr>
                <th>{t("Fee Category")}</th>
                <th>{t("Semester")}</th>
                <th>{t("Total Amount")}</th>
                <th>{t("Paid")}</th>
                <th>{t("Balance")}</th>
                <th>{t("Status")}</th>
              </tr>

            </thead>

            <tbody>

              {feeDetails.length > 0 ? (
                feeDetails.map((fee) => {

                  const amount = Number(fee.amount || 0);

                  const paid = Number(
                    fee.paidAmount || 0
                  );

                  const balance = Math.max(
                    amount - paid,
                    0
                  );

                  return (
                    <tr key={fee.id}>

                      <td>
                        <strong>
                          {fee.category}
                        </strong>
                      </td>

                      <td>
                        {fee.semester}
                      </td>

                      <td>
                        {formatCurrency(amount)}
                      </td>

                      <td>
                        {formatCurrency(paid)}
                      </td>

                      <td>
                        {formatCurrency(balance)}
                      </td>

                      <td>

                        <span
                          className={`billing-status billing-status-${String(
                            fee.status || ""
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {t(fee.status)}
                        </span>

                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>

                  <td
                    colSpan="6"
                    style={{ textAlign: "center" }}
                  >
                    {t("No fee details available.")}
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =====================================================
          PAYMENT HISTORY
      ====================================================== */}

      <section className="dashboard-section">

        <SectionHeader
          title="Payment History"
          subtitle="Recent fee payment transactions"
        />

        <div className="billing-history-list">

          {paymentHistory.length > 0 ? (
            paymentHistory.map((payment) => (

              <div
                className="billing-history-item"
                key={payment.id}
              >

                <div className="billing-history-icon">
                  <Receipt size={20} />
                </div>

                <div className="billing-history-content">

                  <div className="billing-history-title-row">

                    <div>

                      <h4>
                        {payment.feeType ||
                          "Fee Payment"}
                      </h4>

                      <span>
                        {payment.date}
                      </span>

                    </div>

                    <strong className="billing-history-amount">
                      {formatCurrency(payment.amount)}
                    </strong>

                  </div>

                  <div className="billing-history-details">

                    <span>
                      Transaction ID:{" "}
                      {payment.transactionId}
                    </span>

                    <span>
                      Method: {payment.method}
                    </span>

                    <span>
                      Receipt:{" "}
                      {payment.receiptNumber}
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setSelectedReceipt(payment)
                  }
                >
                  <Eye size={16} />
                  View Receipt
                </button>

              </div>

            ))
          ) : (
            <div className="billing-empty-state">
              <Receipt size={30} />
              <h3>{t("No payment history")}</h3>
              <p>
                {t("Your payment transactions will appear here.")}
              </p>
            </div>
          )}

        </div>

      </section>

      {/* =====================================================
          PAYMENT RECEIPTS
      ====================================================== */}

      <section className="dashboard-section">

        <SectionHeader
          title="Payment Receipts"
          subtitle="Download, view and print your fee payment receipts"
        />

        <div className="billing-receipts-container">

          {paymentHistory.length > 0 ? (

            paymentHistory.map((payment) => (

              <div
                className="billing-receipt-card"
                key={`receipt-${payment.id}`}
              >

                {/* RECEIPT ICON */}

                <div className="billing-receipt-icon">
                  <Receipt size={22} />
                </div>

                {/* RECEIPT INFORMATION */}

                <div className="billing-receipt-info">

                  <div className="billing-receipt-header">

                    <div>

                      <h3>
                        {t("Fee Payment Receipt")}
                      </h3>

                      <span>
                        {payment.receiptNumber}
                      </span>

                    </div>

                    <span className="billing-receipt-status">
                      <CheckCircle2 size={15} />
                      {t(payment.status)}
                    </span>

                  </div>

                  <div className="billing-receipt-details-grid">

                    <div>
                      <span>{t("Receipt Number")}</span>
                      <strong>
                        {payment.receiptNumber}
                      </strong>
                    </div>

                    <div>
                      <span>{t("Payment Date")}</span>
                      <strong>
                        {payment.date}
                      </strong>
                    </div>

                    <div>
                      <span>{t("Amount")}</span>
                      <strong>
                        {formatCurrency(payment.amount)}
                      </strong>
                    </div>

                    <div>
                      <span>{t("Payment Method")}</span>
                      <strong>
                        {payment.method}
                      </strong>
                    </div>

                    <div className="billing-receipt-transaction">
                      <span>{t("Transaction ID")}</span>
                      <strong>
                        {payment.transactionId}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* RECEIPT ACTIONS */}

                <div className="billing-receipt-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setSelectedReceipt(payment)
                    }
                  >
                    <Eye size={16} />
                    {t("View Receipt")}
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setSelectedReceipt(payment);

                      setTimeout(() => {
                        window.print();
                      }, 200);
                    }}
                  >
                    <Printer size={16} />
                    {t("Print / Save")}
                  </button>

                </div>

              </div>

            ))

          ) : (

            <div className="billing-empty-state">

              <Receipt size={32} />

              <h3>
                {t("No receipts available")}
              </h3>

              <p>
                {t("Receipts will appear here after a successful fee payment.")}
              </p>

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          BILLING INFORMATION
      ====================================================== */}

      <section className="dashboard-section">

        <SectionHeader
          title="Billing Information"
          subtitle="Student billing details"
        />

        <div className="billing-info-card">
          <div className="billing-info-item">
            <span>{t("Student Name")}</span>
            <strong>
              {studentData?.name || "Thanusha Reddy"}
            </strong>
          </div>

          <div className="billing-info-item">
            <span>{t("Student ID")}</span>
            <strong>
              {studentData?.id || "STU2026001"}
            </strong>
          </div>

          <div className="billing-info-item">
            <span>{t("Program")}</span>
            <strong>
              {studentData?.program || `B.Tech ${studentData?.branch || "CSE"}`}
            </strong>
          </div>

          <div className="billing-info-item">
            <span>{t("Payment Status")}</span>
            <strong
              className={`billing-account-status billing-account-status-${paymentStatus
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {paymentStatus}
            </strong>
          </div>
        </div>

      </section>

      {/* =====================================================
          PAYMENT MODAL
      ====================================================== */}

      {showPaymentModal && (

        <div className="billing-modal-overlay">

          <div className="billing-payment-modal">

            <button
              type="button"
              className="billing-modal-close"
              onClick={() =>
                setShowPaymentModal(false)
              }
            >
              <X size={20} />
            </button>

            <div className="billing-modal-icon">
              <CreditCard size={26} />
            </div>

            <h2>
              Pay Outstanding Fee
            </h2>

            <p>
              Complete the demo payment for your
              outstanding college fee.
            </p>

            <div className="billing-payment-amount">

              <span>{t("Amount to Pay")}</span>

              <strong>
                {formatCurrency(dueAmount)}
              </strong>

            </div>

            <div className="billing-payment-method">

              <label>
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              >
                <option value="UPI">
                  UPI
                </option>

                <option value="Debit Card">
                  Debit Card
                </option>

                <option value="Credit Card">
                  Credit Card
                </option>

                <option value="Net Banking">
                  Net Banking
                </option>
              </select>

            </div>

            <div className="billing-demo-note">
              <AlertCircle size={16} />

              <span>
                This is a demo payment for the
                Ask Campiko project. No real money
                will be charged.
              </span>

            </div>

            <button
              type="button"
              className="primary-button billing-confirm-payment"
              onClick={handlePayment}
            >
              <CheckCircle2 size={17} />
              Confirm Payment
            </button>

          </div>

        </div>

      )}

      {/* =====================================================
          RECEIPT MODAL
      ====================================================== */}

      {selectedReceipt && (

        <div className="billing-modal-overlay">

          <div className="billing-receipt-modal">

            <button
              type="button"
              className="billing-modal-close"
              onClick={() =>
                setSelectedReceipt(null)
              }
            >
              <X size={20} />
            </button>

            {/* RECEIPT */}

            <div
              className="billing-printable-receipt"
              id="payment-receipt"
            >

              <div className="billing-receipt-brand">

                <div className="billing-receipt-brand-icon">
                  <Receipt size={24} />
                </div>

                <div>
                  <h2>
                    Ask Campiko
                  </h2>

                  <p>
                    Digital Campus Management System
                  </p>
                </div>

              </div>

              <div className="billing-receipt-title">

                <h1>
                  PAYMENT RECEIPT
                </h1>

                <span>
                  PAID
                </span>

              </div>

              <div className="billing-receipt-line" />

              <div className="billing-receipt-student">

                <div>
                  <span>{t("Student Name")}</span>
                  <strong>
                    {studentData?.name ||
                      "Thanusha Reddy"}
                  </strong>
                </div>

                <div>
                  <span>{t("Student ID")}</span>
                  <strong>
                    {studentData?.studentId ||
                      "AC2026CSE001"}
                  </strong>
                </div>

                <div>
                  <span>{t("Program")}</span>
                  <strong>
                    {studentData?.program ||
                      "B.Tech CSE"}
                  </strong>
                </div>

              </div>

              <div className="billing-receipt-payment-details">

                <div>
                  <span>{t("Receipt Number")}</span>
                  <strong>
                    {selectedReceipt.receiptNumber}
                  </strong>
                </div>

                <div>
                  <span>{t("Transaction ID")}</span>
                  <strong>
                    {selectedReceipt.transactionId}
                  </strong>
                </div>

                <div>
                  <span>{t("Payment Date")}</span>
                  <strong>
                    {selectedReceipt.date}
                  </strong>
                </div>

                <div>
                  <span>{t("Payment Method")}</span>
                  <strong>
                    {selectedReceipt.method}
                  </strong>
                </div>

                <div>
                  <span>{t("Fee Type")}</span>
                  <strong>
                    {selectedReceipt.feeType ||
                      "College Fee Payment"}
                  </strong>
                </div>

                <div>
                  <span>{t("Payment Status")}</span>
                  <strong className="receipt-paid">
                    {selectedReceipt.status}
                  </strong>
                </div>

              </div>

              <div className="billing-receipt-total">

                <span>
                  Amount Paid
                </span>

                <strong>
                  {formatCurrency(
                    selectedReceipt.amount
                  )}
                </strong>

              </div>

              <div className="billing-receipt-footer">

                <p>
                  This is a computer-generated
                  payment receipt from Ask Campiko.
                </p>

                <p>
                  Keep this receipt for your records.
                </p>

              </div>

            </div>

            {/* RECEIPT ACTIONS */}

            <div className="billing-receipt-modal-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={handlePrintReceipt}
              >
                <Printer size={17} />
                Print Receipt
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handlePrintReceipt}
              >
                <Download size={17} />
                Print / Save as PDF
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Billing;