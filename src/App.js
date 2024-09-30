import { useState, useEffect } from "react";
import "./styles.css";

const pricingTable = [
  { id: 0, equipment: "Custom", rentalPrice: 0, purchasePrice: 0 },
  { id: 1, equipment: "CPAP", rentalPrice: 150, purchasePrice: 995 },
  {
    id: 2,
    equipment: "Semi Electric Hospital Bed",
    rentalPrice: 150,
    purchasePrice: 1100,
  },
  {
    id: 3,
    equipment: "Full Electric Hospital Bed",
    rentalPrice: 110,
    purchasePrice: 1300,
  },
  {
    id: 4,
    equipment: "K1,K2,K3,K6 Wheelchair",
    rentalPrice: 50,
    purchasePrice: 295,
  },
  { id: 5, equipment: "K7 Wheelchair", rentalPrice: 95, purchasePrice: 595 },
  { id: 6, equipment: "Hoyer Lift", rentalPrice: 100, purchasePrice: 795 },
  { id: 7, equipment: "Trapeze Bar", rentalPrice: 60, purchasePrice: 195 },
  { id: 8, equipment: "BIPAP", rentalPrice: 300, purchasePrice: 1950 },
  { id: 9, equipment: "BIPAP ST", rentalPrice: 500, purchasePrice: 3300 },
  { id: 10, equipment: "BIPAP ASV", rentalPrice: 500, purchasePrice: 4360 },
  { id: 11, equipment: "Nebulizer", rentalPrice: 15, purchasePrice: 75 },
  { id: 12, equipment: "Joey Pump", rentalPrice: 150, purchasePrice: 1100 },
  { id: 13, equipment: "Pulse Oximeter", rentalPrice: 95, purchasePrice: 1400 },
  {
    id: 14,
    equipment: "Trilogy Ventilator",
    rentalPrice: 1800,
    purchasePrice: 14000,
  },
  {
    id: 15,
    equipment: "Knee Walker",
    rentalPrice: 95,
    purchasePrice: 325,
  },
];

const App = () => {
  const [pricing, setPricing] = useState(pricingTable);

  useEffect(() => {
    const storedEquipment = localStorage.getItem("customEquipment");
    if (storedEquipment) {
      const customEquipment = JSON.parse(storedEquipment);

      setPricing((prevPricing) => {
        const existingIds = new Set(prevPricing.map((item) => item.id));
        const nonDuplicateCustomEquipment = customEquipment.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prevPricing, ...nonDuplicateCustomEquipment];
      });
    }
  }, []);

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
    setPricing((prevPricing) => {
      const updatedPricing = [...prevPricing, newEquipment];

      const customEquipment = updatedPricing.filter((item) => item.id > 15);
      localStorage.setItem("customEquipment", JSON.stringify(customEquipment));

      return updatedPricing;
    });
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
            setPricing={setPricing}
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

const EquipmentSelection = ({
  selEquip,
  onSelEquip,
  equipment,
  setPricing,
}) => {
  const handleSelectionChange = (e) => {
    onSelEquip(equipment.find((item) => item.equipment === e.target.value));
  };

  const clearCustomEquipment = () => {
    setPricing((prevPricing) => prevPricing.filter((item) => item.id <= 15));

    localStorage.removeItem("customEquipment");
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
        <button className="clear-button" onClick={clearCustomEquipment}>
          Clear Custom Equipment
        </button>
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

    if (parseInt(customRP) === 0 || parseInt(customPP) === 0) {
      alert("Custom rental rate and custom purchase price can not be 0");
      return;
    }
    if (customName === "") {
      alert("You must enter a name for the equipment");
      return;
    }

    const customEquip = {
      id: equipment[equipment.length - 1].id + 1,
      equipment: customName,
      rentalPrice: customRP,
      purchasePrice: customPP,
    };

    onAddEquipment(customEquip);

    setCustomName("");
    setCustomPP("");
    setCustomRP("");
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

  const calculateIndividualPayments = (payments) => {
    for (let i = 0; i < payments.length; i++) {
      let sum = 0;
      for (let i = 0; i < payments.length; i++) {
        sum += Number(payments[i].payment);
      }
      return sum;
    }
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
      <p>
        Total Insurance Payments:{" "}
        {insurancePayments.length !== 0
          ? calculateIndividualPayments(insurancePayments)
          : 0}
      </p>
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

  const calculateIndividualPayments = (payments) => {
    for (let i = 0; i < payments.length; i++) {
      let sum = 0;
      for (let i = 0; i < payments.length; i++) {
        sum += Number(payments[i].payment);
      }
      return sum;
    }
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
      <p>
        Total Patient Payments:{" "}
        {patientPayments.length !== 0
          ? calculateIndividualPayments(patientPayments)
          : 0}
      </p>
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
  const calculatePayments = (payments) => {
    let sum = 0;
    for (let i = 0; i < payments.length; i++) {
      sum += Number(payments[i].payment);
    }
    return sum;
  };

  let equipmentPurchasePrice =
    selEquip.equipment === "Custom" ? customPP : selEquip.purchasePrice;
  let equipmentRentalPrice =
    selEquip.equipment === "Custom" ? customRP : selEquip.rentalPrice;

  const calculatedPrice =
    equipmentPurchasePrice -
    (calculatePayments(insurancePayments) + calculatePayments(patientPayments));

  const calculatedRentalRate =
    calculatedPrice / 3 < equipmentRentalPrice
      ? calculatedPrice / 3
      : equipmentRentalPrice;
  return (
    <div className="ctp-wrapper">
      <h3>Convert to Purchase details</h3>
      <label>Total amount paid:</label>
      <input
        type="text"
        disabled
        value={
          calculatePayments(insurancePayments) +
          calculatePayments(patientPayments)
        }
      ></input>
      <label>Month 1 cost:</label>
      <input
        type="text"
        disabled
        value={
          calculatedRentalRate <= 0 ? "Paid to purchase" : calculatedRentalRate
        }
      ></input>
      <label>Month 2 cost:</label>
      <input
        type="text"
        disabled
        value={
          calculatedRentalRate <= 0 ? "Paid to purchase" : calculatedRentalRate
        }
      ></input>
      <label>Month 3 cost:</label>
      <input
        type="text"
        disabled
        value={
          calculatedRentalRate <= 0 ? "Paid to purchase" : calculatedRentalRate
        }
      ></input>
      <label>Convert to purchase price:</label>
      <input
        type="text"
        disabled
        value={
          calculatedPrice - calculatedRentalRate * 3 <= 0
            ? "Paid to purchase"
            : calculatedPrice - calculatedRentalRate * 3
        }
      ></input>
    </div>
  );
};

export default App;
