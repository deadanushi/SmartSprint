# Create Company - TODO

- Frontend: implement create-company flow on Register step 3
  - Persist new company selection state
  - Build service method to call API (companies.create)
  - Handle success (set selected company from API response) and errors (inline)
  - Loading/disabled states on submission button

- Backend: implement companies API (to be wired later)
  - POST /api/companies → create company { name, industry }
  - Validate unique name (case-insensitive) and required fields
  - Return created company payload { id, name, industry }

- Integration
  - Replace static create option with actual API call
  - Add errors (e.g., name already exists)

