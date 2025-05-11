import React, { useState } from 'react';

interface DriveFormData {
  vaccineName: string;
  driveDate: string;
  availableDoses: number;
  applicableClasses: string; // comma-separated input
}

const DriveForm: React.FC = () => {
  const [formData, setFormData] = useState<DriveFormData>({
    vaccineName: '',
    driveDate: '',
    availableDoses: 0,
    applicableClasses: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.vaccineName || !formData.driveDate || formData.availableDoses <= 0) {
      alert('Please fill all required fields: Vaccine Name, Drive Date, and Available Doses.');
      return;
    }

    const classes = formData.applicableClasses
      .split(',')
      .map(cls => cls.trim())
      .filter(cls => cls !== '');
    if (classes.length === 0) {
      alert('Please provide at least one applicable class.');
      return;
    }

    const payload = {
      vaccineName: formData.vaccineName,
      driveDate: formData.driveDate,
      availableDoses: formData.availableDoses,
      applicableClasses: classes,
    };

    try {
      const response = await fetch('http://localhost:9095/api/drives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${localStorage.getItem('token')}',
        },
        body: JSON.stringify(payload),
      });


      alert('Drive successfully created!');
      setFormData({
        vaccineName: '',
        driveDate: '',
        availableDoses: 0,
        applicableClasses: '',
      });
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New Vaccination Drive</h3>

      <div>
        <label htmlFor="vaccineName">Vaccine Name:</label>
        <input
          type="text"
          id="vaccineName"
          name="vaccineName"
          value={formData.vaccineName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="driveDate">Date:</label>
        <input
          type="date"
          id="driveDate"
          name="driveDate"
          value={formData.driveDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="availableDoses">Available Doses:</label>
        <input
          type="number"
          id="availableDoses"
          name="availableDoses"
          value={formData.availableDoses}
          onChange={handleChange}
          required
          min="1"
        />
      </div>

      <div>
        <label htmlFor="applicableClasses">Applicable Classes (comma separated):</label>
        <input
          type="text"
          id="applicableClasses"
          name="applicableClasses"
          value={formData.applicableClasses}
          onChange={handleChange}
          placeholder="e.g. 5A, 6B"
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit">Submit</button>
        <button
          type="reset"
          onClick={() =>
            setFormData({
              vaccineName: '',
              driveDate: '',
              availableDoses: 0,
              applicableClasses: '',
            })
          }
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default DriveForm;