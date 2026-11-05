# Project Guidelines & Memory

## Directory Scope
- **Active Development (`Mmain/`)**: All implementation, edits, feature additions, and fixes must be made **only** in the `Mmain` directory.
- **Reference Only (`Madmin/`)**: The `Madmin` directory is **strictly for reference only**. Do **NOT** modify, delete, or create any files in `Madmin`.
  - **Reference Mapping**: Refer to `Madmin/M-r` for frontend UI/UX components, styling, and layouts. Refer to `Madmin/M-api` for backend reference.
- **Reference Only (`mr/` - Multi-Brand Architecture)**: The `mr` directory is **strictly for reference only**. Do **NOT** modify, delete, or commit any files in `mr`.
  - Refer to `mr/mrweb` for multi-brand customer website / storefront reference.
  - Refer to `mr/mrad` for multi-brand admin dashboard reference.
  - Refer to `mr/mrap` for multi-brand backend (API) and production-level architecture reference.

## Git Repository Scope & Push Policy
- **Target Repository**: Only `Mmain` is connected to the Git repository `https://github.com/Hamza-Mansuri/MPerfume.git`.
- **Commit Scope**: All Git actions (staging, commits, branches) must strictly be executed within `Mmain`. Never commit or stage anything from `Madmin` or `mr`.
- **Manual Push Only**: Do **NOT** push to Git automatically. The user will push to the repository manually. Do not run `git push`.
