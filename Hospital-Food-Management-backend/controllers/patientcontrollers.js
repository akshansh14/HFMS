const prisma = require("../prisma/server");

// Create patient
exports.createPatient = async (req, res) => {
    try {
        const { name, roomNumber, contactInfo, address, age, gender, bedNumber, floorNumber, diseases, allergies, emergencyContact } = req.body;

        // Ensure that diseases and allergies are arrays
        if (!Array.isArray(diseases) || !Array.isArray(allergies)) {
            return res.status(400).json({ message: "Diseases and Allergies must be arrays." });
        }

        if (!emergencyContact) {
            return res.status(400).json({ message: "Emergency contact is required." });
        }

        const patient = await prisma.patient.create({
            data: {
                name,
                roomNumber,
                contactInfo,
                address,
                age,
                gender,
                bedNumber,
                floorNumber,
                diseases, 
                allergies,
                emergencyContact,
            },
        });

        res.status(201).json({
            message: "Patient created successfully",
            patient,
        });
    } catch (error) {
        res.status(500).json({
            message: `Error creating patient: ${error.message}`,
        });
    }
};


//get patients
exports.getPatients=async(req,res)=>{
    try {
        const patients = await prisma.patient.findMany();
        res.status(200).json({
            message: "Patients retrieved successfully",
            patients,
        });
    } catch (error) {
        res.status(500).json({
            message: `Error fetching patients: ${error.message}`,
        })
    }
}

exports.deletePatient=async(req,res)=>{
    try {
        const { id } = req.params;
        const patient = await prisma.patient.findUnique({
            where: {
                id: id,
            },
        });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        await prisma.patient.delete({
            where: {
                id: id,
            },
        });

        res.status(200).json({
            message: "Patient deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: `Error deleting patient: ${error.message}`,
        })
    }
}

exports.updatePatient = async (req, res) => {
	try {
		const { id } = req.params; // Get patient ID from the URL parameters
		const {
			name,
			roomNumber,
			contactInfo,
			address,
			age,
			gender,
			bedNumber,
			floorNumber,
			diseases,
			allergies,
			emergencyContact,
		} = req.body;

		// Check if the patient exists
		const patient = await prisma.patient.findUnique({
			where: {
				id: id,
			},
		});

		if (!patient) {
			return res.status(404).json({
				message: "Patient not found",
			});
		}

		const updateData = {};

		// Update patient fields if they exist in the request body
		if (name) updateData.name = name;
		if (roomNumber) updateData.roomNumber = roomNumber;
		if (contactInfo) updateData.contactInfo = contactInfo;
		if (address) updateData.address = address;
		if (age) updateData.age = age;
		if (gender) updateData.gender = gender;
		if (bedNumber) updateData.bedNumber = bedNumber;
		if (floorNumber) updateData.floorNumber = floorNumber;
		if (emergencyContact) updateData.emergencyContact = emergencyContact;

		// For diseases and allergies, update only if they are provided in the request body
		if (diseases !== undefined) updateData.diseases = diseases; // Directly save the new diseases array
		if (allergies !== undefined) updateData.allergies = allergies; // Directly save the new allergies array

		const updatedPatient = await prisma.patient.update({
			where: {
				id: id,
			},
			data: updateData,
		});

		res.status(200).json({
			message: "Patient updated successfully",
			patient: updatedPatient,
		});
	} catch (error) {
		res.status(500).json({
			message: Error `updating patient: ${error.message}`,
		});
	}
};