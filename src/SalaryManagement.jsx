import React, { useState, useEffect, useRef } from "react";
// import { employeeService, salaryService } from "../service/apiService";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../src/assets/logo.png";
import stamp from "../src/assets/Stamp sign payal mandal.png";
import USirStamp from "./assets/Stamp sign Umesh SIr.png";

const SalaryManagement = ({ salaryData }) => {
  console.log("salary Data : ", salaryData);

  // Format currency with commas
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount);
  };
  function toTitleCase(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-start items-start">
            <img
              src={logo}
              alt="Osumare Marketing Solutions Logo"
              className="h-20 mx-auto"
            />
          </div>
          <div className="text-end items-end">
            <p className="text-sm text-gray-600">Payslip For the Month</p>
            <p className="font-bold">{salaryData?.employee?.payPeriod}</p>
          </div>
        </div>
      </header>

      {/* Horizontal Line below header */}
      <div className="flex flex-col gap-[1px]">
        <div className="w-full h-0.5 bg-gradient-to-r from-[#612223] via-[#612223] to-[#612223]"></div>
        <div className="w-full h-2 bg-gradient-to-r from-[#612223] via-[#612223] to-[#612223]"></div>
      </div>

      {/* Content Area - Salary Slip */}
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto font-sans text-gray-800 bg-white">
          {/* Header */}

          {/* Employee Summary */}
          <div className="mb-4">
            <h2 className="text-sm uppercase font-bold text-gray-600 mb-2">
              EMPLOYEE SUMMARY
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex">
                  <span className="w-32 text-sm">Employee Name</span>
                  <span className="text-sm">
                    :{" "}
                    {salaryData?.employee?.name
                      ? toTitleCase(salaryData.employee.name)
                      : ""}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-sm">Designation</span>
                  <span className="text-sm">
                    : {salaryData?.employee?.designation}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-sm">Employee ID</span>
                  <span className="text-sm">
                    : {`OMS ${salaryData?.employee?.id}`}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-sm">Date of Joining</span>
                  <span className="text-sm">
                    : {salaryData?.employee?.dateOfJoining}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-sm">Pay Period</span>
                  <span className="text-sm">
                    : {salaryData?.employee?.payPeriod}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-sm">Pay Date</span>
                  <span className="text-sm">
                    : {salaryData?.employee?.payDate}
                  </span>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded border border-orange-50">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    ₹{formatCurrency(salaryData?.payment?.totalNetPay)}
                  </h3>
                  <p className="text-sm text-gray-600">Total Net Pay</p>
                </div>
                <div className="border-t border-green-200 pt-2 ">
                  <div className="flex justify-between mb-1 w-full">
                    <span className="text-sm w-[80%]">Total Working Days</span>
                    <span className="text-sm font-medium w-[20%] text-start">
                      : {salaryData?.payment?.paidDays}
                    </span>
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="text-sm w-[80%]">LOP Days</span>
                    <span className="text-sm font-medium w-[20%] text-start">
                      : {" " + salaryData?.payment?.lopDays}
                    </span>
                  </div>
                  <div className="flex justify-between  w-full">
                    <span className="text-sm w-[80%]">Paid Leaves</span>
                    <span className="text-sm font-medium w-[20%] text-start">
                      : {" " + salaryData?.paidLeaveDayes}
                    </span>
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="text-sm w-[80%]">Holidays</span>
                    <span className="text-sm font-medium w-[20%] text-start">
                      : {" " + salaryData?.holidayes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="mb-4 border-t border-b border-gray-300 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex">
                <span className="w-32 text-sm">PF A/C Number</span>
                <span className="text-sm">
                  : {salaryData?.employee?.pfNumber}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm">Pan No</span>
                <span className="text-sm">
                  : {salaryData?.employee?.PanNumber}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm">Bank Account No</span>
                <span className="text-sm">
                  : {salaryData?.employee?.bankAccount}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm">ESIC Number</span>
                <span className="text-sm">
                  : {salaryData?.employee?.esiNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions */}
          <div className="mb-4 border border-gray-300 rounded">
            <div className="grid grid-cols-2 gap-0">
              {/* Earnings */}
              <div className="border-r border-gray-300">
                <div className="bg-gray-100 p-2 border-b border-gray-300 flex">
                  <div className="w-1/2 text-sm font-bold">EARNINGS</div>
                  <div className="w-1/4 text-right text-sm font-bold ml-auto  justify-end items-end">
                    AMOUNT
                  </div>
                </div>
                <div className="flex flex-col h-[85%] gap-2 justify-between">
                  <div>
                    {salaryData?.earnings?.map((item, index) => (
                      <div key={index} className="p-2 flex">
                        <div className="w-1/2 text-sm">{item?.title}</div>
                        <div className="w-1/4 text-right text-sm justify-end ml-auto">
                          ₹{formatCurrency(item?.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 flex font-bold">
                    <div className="w-1/2 text-sm">Gross Earnings</div>
                    <div className="w-1/4 text-right text-sm justify-end ml-auto">
                      ₹{formatCurrency(salaryData?.grossEarnings)}
                    </div>
                    {/* <div className="w-1/4"></div> */}
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <div className="bg-gray-100 p-2 border-b border-gray-300 flex">
                  <div className="w-1/2 text-sm font-bold">DEDUCTIONS</div>
                  <div className="w-1/4 text-right text-sm font-bold justify-end ml-auto">
                    AMOUNT
                  </div>
                </div>

                {salaryData?.deductions?.map((item, index) => (
                  <div key={index} className="p-2 flex">
                    <div className="w-1/2 text-sm">{item?.title}</div>
                    <div className="w-1/4 text-right text-sm justify-end ml-auto">
                      ₹{formatCurrency(item?.amount)}
                    </div>
                  </div>
                ))}

                <div className="p-2 flex">
                  <div className="w-1/2 text-sm">Deduction</div>
                  <div className="w-1/4 text-right text-sm ml-auto">
                    ₹{formatCurrency(salaryData?.otherDeductions || 0)}
                  </div>
                </div>

                <div
                  className="mt-auto p-2 flex font-bold"
                  style={{ marginTop: "auto" }}
                >
                  <div className="w-1/2 text-sm">Total Deductions</div>
                  <div className="w-1/4 text-right text-sm justify-end ml-auto">
                    ₹{formatCurrency(salaryData?.totalDeductions)}
                  </div>
                  {/* <div className="w-1/4"></div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Total Net Payable */}
          <div className="mb-4">
            <div className="flex justify-between bg-gray-100 p-2 rounded">
              <div className="text-center items-center ">
                <div className="flex items-center justify-center">
                  <img
                    src={
                      salaryData?.employee?.name === "payal mandal"
                        ? USirStamp
                        : stamp
                    }
                    alt="Osumare Marketing Solutions stamp"
                    className="h-[80px] w-[80px] my-0 py-0 top-0 bottom-0"
                  />
                </div>
                <span>Osumare Marketing Solutions Pvt. Ltd.</span>
              </div>
              <div>
                <div className="text-sm font-bold">TOTAL NET PAYABLE</div>
                <div className="text-xs text-gray-600">
                  Gross Earnings - Total Deductions
                </div>
              </div>

              <div className="bg-green-50 px-4 py-0 h-10 font-bold text-right ">
                ₹{formatCurrency(salaryData?.payment?.totalNetPay)}
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="text-center text-sm border-t border-gray-300 pt-2">
            <span className="font-medium">Amount in Words:</span>{" "}
            {salaryData?.amountInWords}
          </div>
        </div>
      </div>

      {/* Horizontal Line above footer */}

      <div className="flex flex-col gap-[1px]">
        <div className="w-full h-0.5 bg-gradient-to-r from-[#612223] via-[#612223] to-[#612223]"></div>
        <div className="w-full h-2 bg-gradient-to-r from-[#612223] via-[#612223] to-[#612223]"></div>
      </div>

      {/* Footer */}
      <footer className="bg-white p-4 text-center text-gray-600 text-xs">
        <div className="max-w-4xl mx-auto">
          <p>
            Osumare Marketing Solutions Pvt. Ltd., Osumare Building, Survey No.
            43, Pathare Thube Nagar, Nagar Road, Kharadi, Pune 14
          </p>
          <p>www.osumare.com</p>
        </div>
      </footer>
    </div>
  );
};

export default SalaryManagement;
