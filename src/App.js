import { useState } from "react";
import "./styles.css";

const pricingTable = [
  { id: 0, equipment: "Custom", rentalPrice: 0, purchasePrice: 0 },
  { id: 1, equipment: "CPAP", rentalPrice: 150, purchasePrice: 995 },
  { id: 2, equipment: "Hospital Bed", rentalPrice: 150, purchasePrice: 1100 },
  { id: 3, equipment: "K1 Wheelchair", rentalPrice: 150, purchasePrice: 295 },
];

const App = () => {
  const [pricing, setPricing] = useState(pricingTable);

  const [selectedEquip, setSelectedEquip] = useState({
    id: 1,
    equipment: "CPAP",
    rentalPrice: 150,
    purchasePrice: 995,
  });

  const [customRentalPrice, setCustomRentalPrice] = useState(0);
  const [customPurchasePrice, setCustomPurchasePrice] = useState(0);
  const [customName, setCustomName] = useState("");

  const [insurancePayments, setInsurancePayments] = useState([]);
  const [patientPayments, setPatientPayments] = useState([]);

  const handleAddPricing = (newEquipment) => {
    setPricing((pricingTable) => [...pricingTable, newEquipment]);
  };
  return (
    <div className="app">
      <div className="main-wrapper">
        <Header />
        <div className="equipment-wrapper">
          <EquipmentSelection
            selEquip={selectedEquip}
            onSelEquip={setSelectedEquip}
            equipment={pricing}
          />
          <CustomEquipment
            selEquip={selectedEquip}
            customRP={customRentalPrice}
            setCustomRP={setCustomRentalPrice}
            customPP={customPurchasePrice}
            setCustomPP={setCustomPurchasePrice}
            customName={customName}
            setCustomName={setCustomName}
            onAddEquipment={handleAddPricing}
            equipment={pricing}
          />
        </div>
        <div className="payresults-wrapper">
          <Payments
            insurancePayments={insurancePayments}
            setInsurancePayments={setInsurancePayments}
            patientPayments={patientPayments}
            setPatientPayments={setPatientPayments}
          />
          <CTPResults
            customRP={customRentalPrice}
            customPP={customPurchasePrice}
            insurancePayments={insurancePayments}
            patientPayments={patientPayments}
            setPatientPayments={setPatientPayments}
            selEquip={selectedEquip}
          />
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header>
      <h1>Convert to Purchase Calculator</h1>
      <h2>Billing tool to convert equipment to patient responsibility</h2>
    </header>
  );
};

const EquipmentSelection = ({ selEquip, onSelEquip, equipment }) => {
  const handleSelectionChange = (e) => {
    onSelEquip(equipment.find((item) => item.equipment === e.target.value));
  };

  return (
    <>
      <div className="equipment-section">
        <label>Select Equipment</label>
        <select value={selEquip.equipment} onChange={handleSelectionChange}>
          {equipment.map((price) => (
            <option value={price.equipment} key={price.id}>
              {price.equipment}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

const CustomEquipment = ({
  selEquip,
  customRP,
  setCustomRP,
  customPP,
  setCustomPP,
  customName,
  setCustomName,
  onAddEquipment,
  equipment,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const customEquip = {
      id: equipment[equipment.length - 1].id + 1,
      equipment: customName,
      rentalPrice: customRP,
      purchasePrice: customPP,
    };

    onAddEquipment(customEquip);
  };
  return (
    <form onSubmit={handleSubmit} className="cequipment-form">
      <div className="input-container">
        <label>Name</label>
        <input
          type="text"
          value={
            selEquip.equipment === "Custom" ? customName : selEquip.equipment
          }
          placeholder="Equipment name..."
          disabled={selEquip.equipment !== "Custom"}
          onChange={(e) => setCustomName(e.target.value)}
        ></input>
      </div>

      <div className="input-container">
        <label>Rental rate</label>
        <input
          type="text"
          value={
            selEquip.equipment === "Custom" ? customRP : selEquip.rentalPrice
          }
          disabled={selEquip.equipment !== "Custom"}
          onChange={(e) =>
            setCustomRP(
              isNaN(Number(e.target.value)) ? customRP : Number(e.target.value)
            )
          }
        ></input>
      </div>

      <div className="input-container">
        <label>Purchase price</label>
        <input
          type="text"
          value={
            selEquip.equipment === "Custom" ? customPP : selEquip.purchasePrice
          }
          disabled={selEquip.equipment !== "Custom"}
          onChange={(e) =>
            setCustomPP(
              isNaN(Number(e.target.value)) ? customPP : Number(e.target.value)
            )
          }
        ></input>
      </div>

      {selEquip.equipment === "Custom" && <button>Save Equipment</button>}
    </form>
  );
};

const Payments = ({
  insurancePayments,
  setInsurancePayments,
  patientPayments,
  setPatientPayments,
}) => {
  return (
    <>
      <InsurancePayments
        insurancePayments={insurancePayments}
        setInsurancePayments={setInsurancePayments}
      />
      <PatientPayments
        patientPayments={patientPayments}
        setPatientPayments={setPatientPayments}
      />
    </>
  );
};

const InsurancePayments = ({ insurancePayments, setInsurancePayments }) => {
  const [insuranceInput, setInsuranceInput] = useState("");

  const handleAddInsurancePayment = () => {
    if (insuranceInput <= 0) return;
    const newInsPayment = { id: crypto.randomUUID(), payment: insuranceInput };
    setInsurancePayments((insPayments) => [...insPayments, newInsPayment]);
    setInsuranceInput("");
  };

  const handleRemoveInsurancePayment = (id) => {
    setInsurancePayments((insPayments) =>
      insPayments.filter((payment) => payment.id !== id)
    );
  };

  const handleClearInsurancePayments = () => {
    setInsurancePayments([]);
  };

  return (
    <div className="inspayments-wrapper">
      <h3>Insurance Payments</h3>
      <div className="payinput-wrapper">
        <input
          type="text"
          placeholder="Enter insurance payment..."
          value={insuranceInput}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) {
              setInsuranceInput(value); // Store the current value as string
            }
          }}
        ></input>
        <button onClick={() => handleAddInsurancePayment()}>Add payment</button>
      </div>
      <div className="inslist-wrapper">
        {insurancePayments.map((payment) => (
          <Payment
            key={payment.id}
            payment={payment.payment}
            id={payment.id}
            onRemovePayment={handleRemoveInsurancePayment}
          />
        ))}
      </div>
      <button
        className="clear-button"
        onClick={() => handleClearInsurancePayments()}
      >
        Clear Insurance Payments
      </button>
    </div>
  );
};

const PatientPayments = ({ patientPayments, setPatientPayments }) => {
  const [patientInput, setPatientInput] = useState("");

  const handleAddPatientPayment = () => {
    if (patientInput <= 0) return;
    const newPatPayment = { id: crypto.randomUUID(), payment: patientInput };
    setPatientPayments((patientPayments) => [
      ...patientPayments,
      newPatPayment,
    ]);
    setPatientInput("");
  };

  const handleRemovePatientPayment = (id) => {
    setPatientPayments((patientPayments) =>
      patientPayments.filter((payment) => payment.id !== id)
    );
  };

  const handleClearPatientPayments = () => {
    setPatientPayments([]);
  };
  return (
    <div className="patpayments-wrapper">
      <h3>Patient Payments</h3>
      <div className="payinput-wrapper">
        <input
          type="text"
          placeholder="Enter patient payment..."
          value={patientInput}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) {
              setPatientInput(value); // Store the current value as string
            }
          }}
        ></input>
        <button onClick={() => handleAddPatientPayment()}>Add payment</button>
      </div>
      <div className="patlist-wrapper">
        {patientPayments.map((payment) => (
          <Payment
            key={payment.id}
            id={payment.id}
            payment={payment.payment}
            onRemovePayment={handleRemovePatientPayment}
          />
        ))}
      </div>
      <button
        className="clear-button"
        onClick={() => handleClearPatientPayments()}
      >
        Clear Patient Payments
      </button>
    </div>
  );
};

const Payment = ({ payment, id, onRemovePayment }) => {
  return (
    <span className="payment-span">
      <p>{payment}</p>
      <button onClick={() => onRemovePayment(id)}>❌</button>
    </span>
  );
};

const CTPResults = ({
  customRP,
  customPP,
  insurancePayments,
  selEquip,
  patientPayments,
}) => {
  let equipmentPurchasePrice =
    selEquip === "custom" ? customPP : selEquip.purchasePrice;
  let equipmentRentalPrice =
    selEquip === "custom" ? customRP : selEquip.rentalPrice;
  const calculatedPrice =
    equipmentPurchasePrice -
    (insurancePayments.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.payment;
    }, 0) +
      patientPayments.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.payment;
      }, 0));
  const calculatedRentalRate =
    calculatedPrice / 3 < equipmentRentalPrice
      ? calculatedPrice / 3
      : equipmentRentalPrice;
  return (
    <div className="ctp-wrapper">
      <h3>Convert to Purchase details</h3>
      <label>Month 1 cost:</label>
      <input
        type="text"
        disabled
        value={
          calculatedRentalRate < 0 ? "Paid to purchase" : calculatedRentalRate
        }
      ></input>
      <label>Month 2 cost:</label>
      <input
        type="text"
        disabled
        value={
          calculatedRentalRate < 0 ? "Paid to purchase" : calculatedRentalRate
        }
      ></input>
      <label>Month 3 cost:</label>
      <input
        type="text"
        disabled
        value={
          calculatedRentalRate < 0 ? "Paid to purchase" : calculatedRentalRate
        }
      ></input>
      <label>Convert to purchase price:</label>
      <input
        type="text"
        disabled
        value={
          calculatedPrice / 3 > customRP ? calculatedPrice - customRP * 3 : 0
        }
      ></input>
    </div>
  );
};

export default App;
