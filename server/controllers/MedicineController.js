const Medicine = require("../models/medicine.js");
const axios = require("axios");

const getMedicines = async (req, res) => {

    try {

        var name = req.query.name;

        let medicines = [];
        if (!name) {
            medicines = await Medicine.find({});
        } else {

            medicines = await Medicine.find({ "name": name });
        }

        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        res.json(medicine);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const isMedicineValid = (newmedicine) => {
    let errorList = [];
    if (!newmedicine.company) {
        errorList[errorList.length] = "Please enter company name";
    }
    if (!newmedicine.name) {
        errorList[errorList.length] = "Please enter medicine name";
    }
    if (!newmedicine.description) {
        errorList[errorList.length] = "Please enter medicine description";
    }
    if (!newmedicine.price) {
        errorList[errorList.length] = "Please enter medicine cost";
    }

    if (errorList.length > 0) {
        result = {
            status: false,
            errors: errorList
        }
        return result;
    }
    else {
        return { status: true };
    }

}

const saveMedicine = async (req, res) => {
    let newmedicine = req.body;
    let medicineValidStatus = isMedicineValid(newmedicine);
    if (!medicineValidStatus.status) {
        res.status(400).json({
            message: 'error',
            errors: medicineValidStatus.errors
        });
    }
    else {
        const medicine = new Medicine(req.body);
        try {
            const savedMedicine = await medicine.save();
            res.status(201).json({ message: 'success' });
        } catch (error) {
            res.status(400).json({ message: 'error', errors: [error.message] });
        }

    }
}

const updateMedicine = async (req, res) => {
    let newmedicine = req.body;
    let medicineValidStatus = isMedicineValid(newmedicine);
    if (!medicineValidStatus.status) {
        res.status(400).json({
            message: 'error',
            errors: medicineValidStatus.errors
        });
    }
    else {
        try {
            const updatedmedicine = await Medicine.updateOne({ _id: req.params.id }, { $set: req.body });
            res.status(201).json({ message: 'success' });
        } catch (error) {
            res.status(400).json({ message: 'error', errors: [error.message] });
        }
    }
}

const deleteMedicine = async (req, res) => {
    try {
        const deletedmedicine = await Medicine.deleteOne({ _id: req.params.id });
        res.status(200).json(deletedmedicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const crawlingMedicines = async (req, res) => {
    try {
        const {quantity} = req.body;
        const result = await axios.get(`https://api.fda.gov/drug/drugsfda.json?limit=${quantity}`);
        if (result && result.data) {
            const medicines = result.data.results;
            const medicines_records = medicines.map(medicine => {
                return {
                    company: medicine.sponsor_name,
                    name: medicine.products[0].brand_name,
                    description: medicine.products[0].dosage_form,
                    price: 10
                }
            });
            await Medicine.insertMany(medicines_records, {ordered: false})
            res.status(200).json({message: `${medicines.length} medicine inserted`})
        } else {
            res.status(200).json({message: '0 medicine inserted'})
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message });
    }
}


module.exports = {
    getMedicines,
    getMedicineById,
    saveMedicine,
    updateMedicine,
    deleteMedicine,
    crawlingMedicines
}
