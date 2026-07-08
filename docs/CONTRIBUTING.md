# Contributing to StadiumIQ

We enforce high standards of code quality, performance, and documentation.

## Code Quality Checklists

Prior to opening any pull requests, ensure that:
1. **Formatting Passes**:
   - Backend python files are formatted using `black` and `isort`.
   - Frontend files are formatted with `prettier`.
2. **Linting Passes**:
   - Running `ruff check .` in `backend/` returns zero violations.
   - Running `npm run lint` in `frontend/` returns zero errors.
3. **TypeScript compiles**:
   - Running `npm run type-check` compiles typescript with zero warnings or errors.
4. **All Tests Pass**:
   - Coverage remains above 85% on backend.
   - All Jest tests pass successfully.
5. **Security Scan**:
   - Running `bandit -r .` catches no vulnerabilities.
