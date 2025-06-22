const db = require('../db');

exports.addMedication = (req, res) => {
  const { name, dosage, frequency } = req.body;
  const userId = req.user.id;

  db.run(
    `INSERT INTO medications (userId, name, dosage, frequency, takenDates) VALUES (?, ?, ?, ?, ?)`,
    [userId, name, dosage, frequency, '[]'],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to add medication' });
      res.status(201).json({ id: this.lastID, name, dosage, frequency });
    }
  );
};

exports.getMedications = (req, res) => {
  const userId = req.user.id;

  db.all(`SELECT * FROM medications WHERE userId = ?`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch medications' });
    res.json(rows);
  });
};

exports.markAsTaken = (req, res) => {
  const medicationId = req.params.medicationId;
  const today = new Date().toISOString().split('T')[0];

  db.get(`SELECT takenDates FROM medications WHERE id = ?`, [medicationId], (err, med) => {
    if (err || !med) return res.status(404).json({ error: 'Medication not found' });

    let dates = JSON.parse(med.takenDates);
    if (!dates.includes(today)) dates.push(today);

    db.run(
      `UPDATE medications SET takenDates = ? WHERE id = ?`,
      [JSON.stringify(dates), medicationId],
      (err) => {
        if (err) return res.status(500).json({ error: 'Failed to mark as taken' });
        res.json({ message: 'Marked as taken', takenDates: dates });
      }
    );
  });
};
