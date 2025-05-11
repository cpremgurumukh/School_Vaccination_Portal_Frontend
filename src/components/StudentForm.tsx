import React, { useState, useEffect } from 'react';
import { Student } from '../types/student.types';

interface StudentFormProps {
  initialData?: Student | null;
  onSubmit: (data: Student) => void;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Student>({
    name: '',
    studentId: '',
    classGrade: '',
    dateOfBirth: '',
    contactNumber: '',
    address: '',
    isVaccinated: false,
    vaccineName: '',
    vaccinationDate: '',
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
        vaccinationDate: initialData.vaccinationDate ? new Date(initialData.vaccinationDate).toISOString().split('T')[0] : '',
      });
    } else {
        setFormData({
            name: '', studentId: '', classGrade: '', dateOfBirth: '',
            contactNumber: '', address: '', isVaccinated: false,
            vaccineName: '', vaccinationDate: '',
        });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.studentId || !formData.classGrade) {
        alert("Please fill in Name, Student ID, and Class/Grade.");
        return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Student' : 'Add New Student'}</h3>
      <div>
        <label htmlFor="name">Full Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="studentId">Student ID:</label>
        <input type="text" id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="classGrade">Class/Grade:</label>
        <input type="text" id="classGrade" name="classGrade" value={formData.classGrade} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="dateOfBirth">Date of Birth:</label>
        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="contactNumber">Contact Number:</label>
        <input type="text" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="address">Address:</label>
        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
      </div>
      
      {/* Vaccination details - typically handled by "Mark Vaccinated" action, but can be here for manual edits */}
      {initialData && ( // Only show for editing existing students, or if you allow setting this on creation
        <>
          <div>
            <label htmlFor="isVaccinated">Is Vaccinated:</label>
            <input type="checkbox" id="isVaccinated" name="isVaccinated" checked={formData.isVaccinated || false} onChange={handleChange} />
          </div>
          {formData.isVaccinated && (
            <>
              <div>
                <label htmlFor="vaccineName">Vaccine Name:</label>
                <input type="text" id="vaccineName" name="vaccineName" value={formData.vaccineName || ''} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="vaccinationDate">Vaccination Date:</label>
                <input type="date" id="vaccinationDate" name="vaccinationDate" value={formData.vaccinationDate || ''} onChange={handleChange} />
              </div>
            </>
          )}
        </>
      )}

      <div style={{ flexDirection: 'row', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit">{initialData ? 'Update Student' : 'Add Student'}</button>
        <button type="button" onClick={onCancel} className="secondary">Cancel</button>
      </div>
    </form>
  );
};

export default StudentForm;