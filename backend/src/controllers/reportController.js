// Report update controller logic
exports.updateReport = async (req, res) => {
  try {
    const { completedTasks, pendingTasks, ...otherData } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...otherData,
          // Empty array handling fallback
          completedTasks: completedTasks || [],
          pendingTasks: pendingTasks || []
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};