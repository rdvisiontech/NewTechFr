import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import { AuthProvider } from './Authorisation/AuthContext';
import HrLoginPage from './Authorisation/HrLoginPage';
import RdvisionLandingPage from './Pages/RdvisionLandingPage';
import Footer from './Components/Footer';
import CareerLandingPage from './Pages/CareerLandingPage';
import ViewJob from './Pages/ViewJob';
import ApplyJob from './Pages/ApplyJob';
import PostNewJob from './Pages/PostNewJob';
import PostedJobs from './Pages/PostedJobs';
import ApplicantList from './Pages/ApplicantList';
import Quiz from './Pages/Quiz';
import ApplicantsScore from './Pages/ApplicantsScore';
import ViewApplication from './Pages/ViewApplication';
import AddQuestion from './Pages/AddQuestion';

function App() {
  return (
    <div className="App bg-blue-50">
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
          <Route exact path="/" element={<RdvisionLandingPage/>} />
          <Route exact path="/careers" element={<CareerLandingPage/>} />
          <Route exact path="/job/:id" element={<ViewJob />} />
          <Route exact path="/apply/:id" element={<ApplyJob />} />
          <Route exact path="/post" element={<PostNewJob/>} />
          <Route exact path="/postedJobs" element={<PostedJobs />} />
          <Route exact path="/aplicantList" element={<ApplicantList />} />
          <Route exact path="/quiz" element={<Quiz />} />
          <Route exact path="/score" element={<ApplicantsScore/>} />
          <Route exact path="/application/:id" element={<ViewApplication/>} />
          <Route exact path="/addQuestion" element={<AddQuestion/>} />


          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
