1. AutoStock: Car Dealership Inventory System



A full-stack inventory app for a car dealership. Users can browse, search and purchase vehicles, and admins can add, edit, restock and delete them. The backend was built test-first (TDD) with FastAPI, and the frontend is a React single-page app styled with Tailwind. Prices are shown in Indian rupees (₹) and the sample data uses cars common in the Indian market.



1.1 Features



\- Register and log in with JWT token authentication

\- Role-based access: regular users and admins

\- Browse all vehicles, and search by make, model, category and price range

\- Sort by price and filter by "in stock"

\- Purchase a vehicle (decreases stock; the button is disabled when stock is zero)

\- Admin only: add, edit, restock and delete vehicles

\- Responsive dark UI with a filter sidebar, built with Tailwind CSS



1.2 Tech stack



| Layer | Technology |

|---|---|

| Backend | Python, FastAPI, SQLAlchemy |

| Database | SQLite (file-based, persistent) |

| Auth | JWT (python-jose), bcrypt password hashing (passlib) |

| Tests | pytest, pytest-cov, FastAPI TestClient |

| Frontend | React (Vite), React Router, Tailwind CSS |



1.3 Architecture



The backend is split into layers so each part has one job:



\- routers/ hold business rules (e.g. "cannot purchase when out of stock")

\- repositories/ are the only code that touches the database

\- models/ define the tables, and schemas.py defines request/response validation (Pydantic)

\- dependencies.py holds the reusable `get\_current\_user` and `require\_admin` guards



Services raise domain exceptions and routers translate them to HTTP status codes, so business logic does not depend on the web layer.



1.4 API endpoints



| Method | Endpoint | Access |

|---|---|---|

| POST | `/api/auth/register` | Public |

| POST | `/api/auth/login` | Public |

| POST | `/api/vehicles` | Logged in |

| GET | `/api/vehicles` | Logged in |

| GET | `/api/vehicles/search` | Logged in |

| PUT | `/api/vehicles/{id}` | Logged in |

| DELETE | `/api/vehicles/{id}` | Admin only |

| POST | `/api/vehicles/{id}/purchase` | Logged in |

| POST | `/api/vehicles/{id}/restock` | Admin only |



Search query parameters: `make`, `model`, `category`, `min\_price`, `max\_price`. Interactive API docs are available at `/docs` while the API is running.



1.5 Running locally



Prerequisites: Python 3.10+, Node.js (LTS), Git.



1.6 Backend



```bash

cd backend

python -m venv venv

source venv/Scripts/activate     # Windows (Git Bash). Mac/Linux: source venv/bin/activate

python -m pip install -r requirements.txt



python create\_admin.py admin@example.com admin123   

python seed.py                                      

python -m uvicorn app.main:app --reload

```



The API runs at http://localhost:8000 (docs at http://localhost:8000/docs).

Optionally set a `SECRET\_KEY` environment variable to override the development default.



1.7 Frontend



In a second terminal:



```bash

cd frontend

npm install

npm run dev

```



The app runs at http://localhost:5173. Log in as `admin@example.com` / `admin123` for admin features, or register a new account (regular user).



1.8 Tests



```bash

cd backend

python -m pytest --cov=app --cov-report=term-missing

```



The tests use a separate SQLite file (`test.db`) that is created and dropped for every test, so real data is never touched.



1.9 Test report



============================= test session starts =============================

platform win32 -- Python 3.14.2, pytest-9.1.1, pluggy-1.7.0

rootdir: C:\\Users\\Veronica Satsangi\\car-dealership\\backend

plugins: anyio-4.15.1, cov-7.1.0

collected 29 items



tests\\test\_auth.py ......                                                \[ 20%]

tests\\test\_edge\_cases.py ....                                            \[ 34%]

tests\\test\_vehicles.py ...................                               \[100%]



============================== warnings summary ===============================

venv\\Lib\\site-packages\\fastapi\\testclient.py:1

&#x20; C:\\Users\\Veronica Satsangi\\car-dealership\\backend\\venv\\Lib\\site-packages\\fastapi\\testclient.py:1: StarletteDeprecationWarning: Using `httpx` with `starlette.testclient` is deprecated; install `httpx2` instead.

&#x20;   from starlette.testclient import TestClient as TestClient  # noqa



\-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html

=============================== tests coverage ================================

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ coverage: platform win32, python 3.14.2-final-0 \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_



Name                                     Stmts   Miss  Cover   Missing

\----------------------------------------------------------------------

app\\\_\_init\_\_.py                              0      0   100%

app\\config.py                                4      0   100%

app\\database.py                             11      4    64%   17-21

app\\dependencies.py                         23      0   100%

app\\main.py                                 10      0   100%

app\\models\\\_\_init\_\_.py                       0      0   100%

app\\models\\user.py                           8      0   100%

app\\models\\vehicle.py                       10      0   100%

app\\repositories\\\_\_init\_\_.py                 0      0   100%

app\\repositories\\user\_repository.py         15      0   100%

app\\repositories\\vehicle\_repository.py      35      0   100%

app\\routers\\\_\_init\_\_.py                      0      0   100%

app\\routers\\auth.py                         22      0   100%

app\\routers\\vehicles.py                     48      0   100%

app\\schemas.py                              18      0   100%

app\\security.py                             19      0   100%

app\\services\\\_\_init\_\_.py                     0      0   100%

app\\services\\auth\_service.py                19      0   100%

app\\services\\vehicle\_service.py             36      0   100%

\----------------------------------------------------------------------

TOTAL                                      278      4    99%

======================== 29 passed, 1 warning in 5.96s ========================





1.10 Screenshots






| | |

|---|---|

| !\[Login](docs/screenshots/login.png) | !\[Dashboard](docs/screenshots/dashboard-user.png) |

| !\[Search](docs/screenshots/search.png) | !\[Sold out](docs/screenshots/sold-out.png) |

| !\[Admin](docs/screenshots/dashboard-admin.png) | !\[Add vehicle](docs/screenshots/admin-form.png) |

|  !\[API docs](docs/screenshots/swagger.png) |



1.11 Development process



Backend features followed Red-Green-Refactor: a commit with a failing test (`test: ... (red)`), followed by a commit with the implementation (`feat: ... (green)`). Registration, login, vehicle creation, and then update, delete, search, purchase and restock were each developed this way. See the Git history.



1.12 Design decisions



\- Admins cannot be created through the API. Registration always creates a regular user, otherwise anyone could make themselves an admin. Admins are created with `create\_admin.py`.

\- Admin rules are enforced on the server. The React app hides admin buttons from regular users, but the API returns 403 regardless of what the frontend does.

\- Same error for wrong email and wrong password on login, so attackers cannot discover which emails are registered.

\- Purchases are rejected with 409 when stock is zero, in addition to the disabled button in the UI.

\- Prices are stored as plain numbers and formatted as rupees (with lakh/crore grouping) in the frontend only.



1.13 My AI Usage



Tool used: Claude (Anthropic), through the claude.ai chat interface. The full conversation is linked in `PROMPTS.md`.



How I used it:

\- Planning: to understand the assignment, compare Django and FastAPI (I chose FastAPI for its lower setup overhead), and plan a schedule for the weekend.

\- Backend: Claude wrote the failing tests and then the implementations. I ran them, committed each red and green step, and asked for explanations of sessions, JWT, dependency injection and the router/service/repository layers.

\- Frontend: Claude generated the React components and Tailwind styling. I ran the app, checked it in the browser, and directed the design: I rejected the first look because it felt generic, picked reference sites, and asked for a dark, minimal style, rupee pricing and Indian car models.

\- Debugging: I pasted terminal errors (mistyped filenames, an inactive virtual environment, PowerShell's script policy, a rejected Git pus) and Claude diagnosed them.

\- Every commit where AI helped has a `Co-authored-by` trailer.





1.13.1 MY AI USAGE / Reflection:



AI made the setup and boilerplate much faster and helped me learn FastAPI, SQLAlchemy and React in a short time, which I could not have done alone in that time. It did not remove the hands-on work, I still ran and tested everything, fixed my own typos, set up Git and Node on Windows, and made the product decisions, like the visual direction. It also got small things wrong, such as miscounting how many tests would pass, so I learned to check its output against what actually ran. I made sure I could explain the layers and the auth flow, because pasting code I could not explain would not help me or the project. 



1.14 Live demo



Not deployed. The app runs locally using the instructions above.

