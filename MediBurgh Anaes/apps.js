import React from 'react';
import SubmitForm from './components/SubmitForm';
import AuditLog from './components/AuditLog';

function App() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-red-700 mb-4">MediBurgh Billing</h1>
      <SubmitForm />
      <AuditLog />
    </div>
  );
}

export default App;