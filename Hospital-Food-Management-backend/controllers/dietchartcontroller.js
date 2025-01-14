const prisma=require('../prisma/server')

// Create a new Diet Chart
 exports.createDietChart = async (req, res) => {
  const {patientId,morningMeal,eveningMeal,nightMeal,morningIngredients,eveningIngredients,nightIngredients,morningInstructions,eveningInstructions, nightInstructions} = req.body;

  try {
    // Validate that the patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const dietChart = await prisma.dietChart.create({
      data: {
        patientId,
        morningMeal,
        eveningMeal,
        nightMeal,
        morningIngredients,
        eveningIngredients,
        nightIngredients,
        morningInstructions,
        eveningInstructions,
        nightInstructions,
      },
    });

    return res.status(201).json(dietChart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

 exports.getDietChart = async (req, res) => {
  const { patientId } = req.params;

  try {
    const dietChart = await prisma.dietChart.findFirst({
      where: { patientId },
    });

    if (!dietChart) {
      return res.status(404).json({ message: "Diet chart not found for this patient" });
    }

    return res.status(200).json(dietChart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

 exports.updateDietChart = async (req, res) => {
  const { patientId,dietChartId } = req.params;
  const {
    morningMeal,
    eveningMeal,
    nightMeal,
    morningIngredients,
    eveningIngredients,
    nightIngredients,
    morningInstructions,
    eveningInstructions,
    nightInstructions,
  } = req.body;

  const updateData={}

  if(morningMeal){
    updateData.morningMeal=morningMeal
    updateData.morningInstructions=morningInstructions
    updateData.morningIngredients=morningIngredients
  }
  if(eveningMeal){
    updateData.eveningMeal=eveningMeal
    updateData.eveningIngredients=eveningIngredients
    updateData.eveningInstructions=eveningInstructions
  }
  if(nightMeal){
    updateData.nightMeal=nightMeal
    updateData.nightIngredients=nightIngredients
    updateData.nightInstructions=nightInstructions
  }

  try {
    const updatedDietChart = await prisma.dietChart.update({
        where: { 
            id:dietChartId,
            patientId,
         },
      data: updateData,
    });

    return res.status(200).json(updatedDietChart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteDietChart = async (req, res) => {
  const { patientId , dietChartId } = req.params;

  try {
    const deletedDietChart = await prisma.dietChart.delete({
      where: { 
        id:dietChartId,
        patientId,
     },
    });

    return res.status(200).json({ message: "Diet chart deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
