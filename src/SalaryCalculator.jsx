import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SalaryManagement from "./SalaryManagement";

const generateSalarySlipPDF = (salaryData) => {
  const input = document.createElement("div");
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  console.log("salaryData from generateSalarySlipPDF", salaryData);
  const root = ReactDOM.createRoot(input);
  root.render(
    <React.StrictMode>
      <SalaryManagement salaryData={salaryData} />
    </React.StrictMode>
  );

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
      })
        .then((canvas) => {
          document.body.removeChild(input);
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [canvas.width, canvas.height],
          });

          pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
          resolve(pdf);
        })
        .catch((err) => {
          document.body.removeChild(input);
          reject(err);
        });
    }, 1000);
  });
};

const SalaryCalculator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empId: "",
    fName: "",
    lName: "",
    salaryMonth: "",
    allowances: 0,
    baseSalary: "",
    availableLeaves: 0,
    paidLeaves: "",
    incentives: 0,
    totalEarning: "",
    noOfLeaves: 0,
    join_date: "",
    halfDays: 0,
    lateMarks: 0,
    penalty: 0,
    advancedSalary: 0,
    professionalTax: "",
    weekOffs: 6,
    holidays: 1,
    totalWorkingDays: "",
    totalLeaves: "",
    bankAccountNo: "",
    PFAccNumber: "",
    PanNumber: "",
    ESICNO: "",
    leavesHalfDaysDeductions: "",
    weekOffDeduction: "",
    totalDeductions: "",
    netSalary: "",
    grossSalary: "",
  });

  console.log("formData", formData);

  // Reset form to initial state
  const resetFormData = () => {
    setFormData({
      empId: "",
      fName: "",
      lName: "",
      salaryMonth: "",
      allowances: 0,
      baseSalary: "",
      availableLeaves: 0,
      incentives: 0,
      totalEarning: "",
      numberOfLeaves: 0,
      noOfLeaves: 0,
      halfDays: 0,
      lateMarks: 0,
      dateOfJoining: "",
      penalty: 0,
      advancedSalary: 0,
      professionalTax: "",
      weekOffs: 6,
      holidays: 1,
      bankAccountNo: "",
      designation: "",
      PFAccNumber: "",
      PanNumber: "",
      ESICNO: "",
      totalWorkingDays: "",
      totalLeaves: "",
      leavesHalfDaysDeductions: "",
      weekOffDeduction: "",
      totalDeductions: "",
      netSalary: "",
      grossSalary: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects for number inputs
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value === "" ? "" : Number(value),
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : Number(value),
      });
    }
  };

  // Salary Calculation Logic from the first code
  const calculateSalary = () => {
    const {
      baseSalary,
      allowances,
      paidLeaves,
      incentives,
      noOfLeaves,
      halfDays,
      lateMarks,
      penalty,
      professionalTax,
      advancedSalary,
      holidays,
      weekOffs,
    } = formData;

    console.log("formData in calcluated slary:", formData);

    // Earnings calculations
    const paidLeaveAmount = (Number(baseSalary) / 30) * Number(paidLeaves);
    console.log("paidLeaveAmount:", paidLeaveAmount);

    const grossSalary =
      Number(baseSalary) + allowances  + Number(incentives);
    console.log("grossSalary:", grossSalary);

    // Deductions calculations
    const leaveDeduction =
      (Number(baseSalary) / 30) * Number(noOfLeaves) ;
    
    const halfDayDeduction = (Number(baseSalary) / 30 / 2) * Number(halfDays);
    const lateMarksDeduction = (Number(baseSalary) / 30) * Number(lateMarks);

    console.log("leaveDeduction:", leaveDeduction);
    console.log("halfDayDeduction:", halfDayDeduction);
    console.log("lateMarksDeduction:", lateMarksDeduction);

    const totalDeductions =
      leaveDeduction +
      halfDayDeduction +
      lateMarksDeduction +
      Number(penalty) +
      Number(professionalTax) +
      Number(advancedSalary);

    console.log("totalDeductions:", totalDeductions);

    // Calculate total leaves and working days
    const totalLeaves = Number(noOfLeaves) + Number(halfDays) / 2;

    console.log("totalLeaves:", totalLeaves);

    const totalWorkingDays =
      30 -
      Number(noOfLeaves) -
      Number(weekOffs) -
      Number(holidays) -
      Number(halfDays) / 2;

    console.log("totalWorkingDays:", totalWorkingDays);

    const leavesPluseHalfDayes =
      Number(baseSalary / 30) * Number(noOfLeaves) +
      (Number(baseSalary / 30) / 2) * Number(halfDays) -
      Number(paidLeaveAmount);

    console.log("leavesPluseHalfDayes:", leavesPluseHalfDayes);

    // Apply week off deduction if total leaves exceed 4
    const weekOffDeduction =
      totalLeaves > 4 ? (Number(baseSalary) / 30) * Number(weekOffs) : 0;
    const finalTotalDeduction = totalDeductions + weekOffDeduction;

    console.log("weekOffDeduction:", weekOffDeduction);
    console.log("finalTotalDeduction:", finalTotalDeduction);

    // Calculate net salary
    const netSalary = grossSalary - finalTotalDeduction;

    console.log("netSalary:", netSalary);

    return {
      paidLeaveAmount,
      grossSalary,
      leaveDeduction,
      halfDayDeduction,
      lateMarksDeduction,
      totalDeductions,
      totalLeaves,
      totalWorkingDays,
      weekOffDeduction,
      finalTotalDeduction,
      netSalary,
      leavesPluseHalfDayes,
      allowances,
    };
  };

  // Get all calculated values
  const salaryInfo = calculateSalary();
  console.log("salaryInfo : ", salaryInfo);

  const handlePrintSalarySlip = async () => {
    try {
      console.log("About to generate PDF");
      const salarySlipData = {
        employee: {
          name: `${formData.fName} ${formData.lName}`,
          designation: formData.designation || "Software Engineer",
          id: formData.empId,
          dateOfJoining: formData.dateOfJoining || "N/A",
          payPeriod: formData.salaryMonth
            ? new Date(formData.salaryMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })
            : "N/A",
          payDate: new Date().toLocaleDateString("en-IN"),
          pfNumber: formData.PFAccNumber || "N/A",
          designation: formData.designation || "N/A",
          PanNumber: formData.PanNumber || "N/A",
          bankAccount: formData.bankAccountNo || "N/A",
          esiNumber: formData.ESICNO || "N/A",
        },
        payment: {
          totalNetPay: salaryInfo.netSalary,
          paidDays: salaryInfo.totalWorkingDays,
          lopDays: salaryInfo.totalLeaves,
        },
        paidLeaveDayes: formData.paidLeaves,
        holidayes:formData.holidays,
        earnings: [
          {
            title: "Basic",
            amount: formData.baseSalary,
          },
          {
            title: "Allowance",
            amount: salaryInfo.allowances,
          },

          {
            title: "Incentives",
            amount: formData.incentives,
          },
        ],
        padiLeaves: {
          title: "Paid Leaves",
          amount: salaryInfo.paidLeaveAmount,
        },
        deductions: [
          {
            title: "Professional Tax",
            amount: formData.professionalTax,
          },
          {
            title: "Leave Deduction",
            amount: salaryInfo.leavesPluseHalfDayes,
          },
          {
            title: "Advanced Salary",
            amount: formData.advancedSalary,
          },
          {
            title: "Week Off Deduction",
            amount: salaryInfo.weekOffDeduction,
          },
        ],

        grossEarnings: salaryInfo.grossSalary,
        leaveDeduction: salaryInfo.leaveDeduction,
        otherDeductions: salaryInfo.lateMarksDeduction + formData.penalty,
        leavesHalfDaysDeductions: salaryInfo.leavesPluseHalfDayes,
        totalDeductions: salaryInfo.finalTotalDeduction,
        amountInWords: convertToWords(Math.round(salaryInfo.netSalary)),
      };

      console.log("salarySlipData", salarySlipData);

      // Generate and download PDF
      const pdf = await generateSalarySlipPDF(salarySlipData);
      console.log("PDF generated",);
      pdf.save(
        `Salary_Slip_${formData.fName}_${formData.lName}_${formData.salaryMonth}.pdf`
      );
      console.log("PDF saved");
    } catch (error) {
      console.error("Error generating salary slip PDF:", error);
      toast.error("Failed to generate salary slip");
    }
  };

  // Helper function to convert number to words
  const convertToWords = (num) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convertGroup = (n) => {
      if (n < 10) return units[n];
      if (n < 20) return teens[n - 10];
      if (n < 100)
        return (
          tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + units[n % 10] : "")
        );
      if (n < 1000)
        return (
          units[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 !== 0 ? " " + convertGroup(n % 100) : "")
        );
      if (n < 100000)
        return (
          convertGroup(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 !== 0 ? " " + convertGroup(n % 1000) : "")
        );
      return (
        convertGroup(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 !== 0 ? " " + convertGroup(n % 100000) : "")
      );
    };

    if (num === 0) return "Zero";
    return `Indian Rupee ${convertGroup(num)} Only`;
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Salary Calculator</h1>
          <button
            onClick={() => navigate("/employees")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back to Employees
          </button>
        </div>

        <form className="bg-white shadow-lg rounded-lg p-6">
          {/* Personal Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="empId"
                  value={formData.empId}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="fName"
                  value={formData.fName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lName"
                  value={formData.lName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Remaining Leaves
                </label>
                <input
                  type="number"
                  name="availableLeaves"
                  value={formData.availableLeaves || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              Acccount Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  PF A/C Number
                </label>
                <input
                  type="text"
                  name="PFAccNumber"
                  value={formData.PFAccNumber}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pan Number
                </label>
                <input
                  type="text"
                  name="PanNumber"
                  value={formData.PanNumber}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank Account No
                </label>
                <input
                  type="text"
                  name="bankAccountNo"
                  value={formData.bankAccountNo}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  ESIC No
                </label>
                <input
                  type="text"
                  name="ESICNO"
                  value={formData.ESICNO}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              Month Information
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Joining Date
              </label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Month Of Salary
              </label>
              <input
                type="month"
                name="salaryMonth"
                value={formData.salaryMonth}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              Salary Information (Earning Sections)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Base Salary
                </label>
                <input
                  type="number"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleNumberChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Other Allowance
                </label>
                <input
                  type="number"
                  name="allowances"
                  value={formData.allowances}
                  onChange={handleNumberChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Paid Leaves
                </label>
                <input
                  type="number"
                  name="paidLeaves"
                  min={0}
                  max={2}
                  value={formData.paidLeaves}
                  onChange={handleNumberChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Incentives
                </label>
                <input
                  type="number"
                  name="incentives"
                  value={formData.incentives}
                  onChange={handleNumberChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xl   font-medium mb-1">
                  Total Earnings
                </label>
                <input
                  type="number"
                  value={Math.round(salaryInfo.grossSalary)}
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              Deduction Section
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  No of Leaves
                </label>
                <input
                  type="number"
                  name="noOfLeaves"
                  value={formData.noOfLeaves}
                  onChange={handleNumberChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Half Days
                </label>
                <input
                  type="number"
                  name="halfDays"
                  value={formData.halfDays}
                  onChange={handleNumberChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Late Marks
                </label>
                <input
                  type="number"
                  name="lateMarks"
                  value={formData.lateMarks}
                  onChange={handleNumberChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Penalty
                </label>
                <input
                  type="number"
                  name="penalty"
                  value={formData.penalty}
                  onChange={handleNumberChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Advanced Salary
                </label>
                <input
                  type="number"
                  name="advancedSalary"
                  value={formData.advancedSalary}
                  onChange={handleNumberChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Professional Tax
                </label>
                <input
                  type="number"
                  name="professionalTax"
                  value={formData.professionalTax}
                  onChange={handleNumberChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xl   font-medium mb-1">
                  Total Deductions
                </label>
                <input
                  type="number"
                  value={Math.round(salaryInfo.finalTotalDeduction)}
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              Week offs and Holidays
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Week offs
                </label>
                <input
                  type="number"
                  name="weekOffs"
                  value={formData.weekOffs}
                  onChange={handleNumberChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Holidays
                </label>
                <input
                  type="number"
                  name="holidays"
                  value={formData.holidays}
                  onChange={handleNumberChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              Total Working Days
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Working Days
                </label>
                <input
                  type="text"
                  value={salaryInfo.totalWorkingDays.toFixed(1)}
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Leaves
                </label>
                <input
                  type="text"
                  value={salaryInfo.totalLeaves}
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Leaves+ Halfday Deduction
                </label>
                <input
                  type="text"
                  value={Math.round(salaryInfo.leavesPluseHalfDayes.toFixed(1))}
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Weekoff Deduction (if Total Leaves greather than 4)
                </label>
                <input
                  type="text"
                  value={Math.round(salaryInfo.weekOffDeduction.toFixed(1))}
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              Salary Calculation Summary
            </h2>
            <div className="flex justify-center px-20 py-5 items-start gap-20 ">
              <div className="flex flex-col gap-2 items-start">
                <div>
                  <p className="text-sm font-medium">
                    Base Salary:{" "}
                    <span className="font-normal">₹{formData.baseSalary}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Total Allowances:{" "}
                    <span className="font-normal">
                      ₹{salaryInfo.allowances}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Paid Leave Amount:{" "}
                    <span className="font-normal">
                      ₹{salaryInfo.paidLeaveAmount.toFixed(2)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Incentives:{" "}
                    <span className="font-normal">₹{formData.incentives}</span>
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold">
                    Gross Salary:{" "}
                    <span className="font-normal">
                      ₹{salaryInfo.grossSalary.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="w-0.5 h-[200px] bg-black"></div>
              <div className="flex flex-col gap-2 items-start">
                <div>
                  <p className="text-sm font-medium">
                    Leave Deduction:{" "}
                    <span className="font-normal">
                      ₹{salaryInfo.leaveDeduction.toFixed(2)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Half Day Deduction:{" "}
                    <span className="font-normal">
                      ₹{salaryInfo.halfDayDeduction.toFixed(2)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Late Marks Deduction:{" "}
                    <span className="font-normal">
                      ₹{salaryInfo.lateMarksDeduction.toFixed(2)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Week Off Deduction:{" "}
                    <span className="font-normal">
                      ₹{salaryInfo.weekOffDeduction.toFixed(2)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Professional Tax:{" "}
                    <span className="font-normal">
                      ₹{formData.professionalTax}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Advanced Salary:{" "}
                    <span className="font-normal">
                      ₹{formData.advancedSalary}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Penalty Amount:{" "}
                    <span className="font-normal">₹{formData.penalty}</span>
                  </p>
                </div>
                <div>
                  <p className="  text-lg font-bold">
                    Total Deductions:{" "}
                    <span className="font-normal">
                      ₹{salaryInfo.finalTotalDeduction.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="col-span-2 border-t pt-2 mt-2">
                <p className="text-xl font-bold">
                  Net Salary:
                  <span className="text-green-600">
                    ₹{salaryInfo.netSalary.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={handlePrintSalarySlip}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
            >
              Print Salary Slip
            </button>
            <button
              type="button"
              onClick={resetFormData}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryCalculator;
