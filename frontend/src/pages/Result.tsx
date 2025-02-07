import React from "react";
import { useLocation } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PrescriptionPDF from "../components/PrescriptionPdf"; // Import PDF component

const Result = () => {
  const location = useLocation();
  const { data } = location.state || {}; // Get prescription data

  return (
    <div
      id="prescription"
      className="p-6 bg-gray-100 min-h-screen flex flex-col gap-6"
    >
      <span className="bg-white p-4 rounded-xl shadow-md text-gray-800 text-center font-bold text-3xl">
        Results
      </span>

      <div className="bg-white p-4 rounded-xl shadow-md text-gray-800 text-center font-medium">
        <strong className="underline underline-offset-2">
          General Instructions{" "}
        </strong>
        : {data.general_instructions}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.medicines.map((medicine: any, index: any) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-green-700">
              {medicine.name}
            </h2>
            <p className="text-gray-700">
              <strong>Dosage:</strong> {medicine.dosage}
            </p>
            <p className="text-gray-700">
              <strong>Frequency:</strong> {medicine.frequency}
            </p>
            <p className="text-gray-700">
              <strong>Route:</strong> {medicine.route}
            </p>
            <p className="text-gray-700">
              <strong>Instructions:</strong> {medicine.special_instructions}
            </p>

            {medicine.websites.map((website: any, idx: any) => (
              <div
                key={idx}
                className="flex justify-between items-center gap-4 p-4 mt-3 border rounded-lg shadow-md"
              >
                <img
                  src={website.image}
                  alt={medicine.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {website.store}
                  </p>
                  <p className="text-green-700 font-bold">{website.price}</p>
                </div>
                <a
                  href={website.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Buy Now
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Download PDF Button */}
      <PDFDownloadLink
        document={<PrescriptionPDF data={data} />} // Pass dynamic data
        fileName="prescription.pdf"
        className="mt-6 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition self-center mb-20"
      >
        {({ loading }) => (loading ? "Generating PDF..." : "Download as PDF")}
      </PDFDownloadLink>

      <footer className="bg-white p-4 rounded-xl shadow-md text-gray-800 text-center font-medium mt-auto mb-20">
        <p>Hope you get well soon!😊</p>
      </footer>
    </div>
  );
};

export default Result;
