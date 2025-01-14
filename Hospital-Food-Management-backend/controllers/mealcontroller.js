const prisma = require("../prisma/server");

exports.createMeal = async (req, res) => {
	const mealData = req.body;
	const { patientId } = req.params;

	try {
		const meal = await prisma.meal.create({
			data: {
				patientId: patientId,
				...mealData,
			},
		});

		return res.status(200).json(meal);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
	}
};

// Get all Meals
exports.getMeals = async (req, res) => {
	try {
		const meals = await prisma.meal.findMany();
		const patient = await prisma.patient.findMany({
			where: { id: meals.patientId },
		});
		return res.status(200).json({ meals, patient });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
	}
};

// Get Meal by ID
exports.getMealById = async (req, res) => {
	const { id } = req.params;

	try {
		const meal = await prisma.meal.findUnique({
			where: { id },
		});

		if (!meal) {
			return res.status(404).json({ message: "Meal not found" });
		}

		return res.status(200).json(meal);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
	}
};

// Update Meal
exports.updateMeal = async (req, res) => {
	const { id } = req.params;
	const { patientId, mealTime, scheduledFor, specialNotes } = req.body;

	try {
		const updatedMeal = await prisma.meal.update({
			where: { id },
			data: {
				patientId,
				mealTime,
				scheduledFor,
				specialNotes,
			},
		});

		return res.status(200).json(updatedMeal);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
	}
};

// Delete Meal
exports.deleteMeal = async (req, res) => {
	const { id } = req.params;

	try {
		await prisma.meal.delete({
			where: { id },
		});

		return res.status(200).json({ message: "Meal deleted successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
	}
};
