import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Card,
  Divider,
  Alert,
  Chip,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  RestartAlt as RestartAltIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const DiabetesRiskCalculator = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [bmi, setBmi] = useState('');
  const [waist, setWaist] = useState('');
  const [physicalActivity, setPhysicalActivity] = useState('yes');
  const [familyHistory, setFamilyHistory] = useState(false);
  const [hypertension, setHypertension] = useState(false);
  const [result, setResult] = useState(null);

  const calculateRisk = () => {
    if (!age || !bmi || !waist) {
      alert('გთხოვთ შეავსოთ ყველა აუცილებელი ველი');
      return;
    }

    let points = 0;

    // Age
    const ageNum = parseInt(age);
    if (ageNum < 45) points += 0;
    else if (ageNum < 55) points += 2;
    else if (ageNum < 65) points += 3;
    else points += 4;

    // BMI
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 25) points += 0;
    else if (bmiNum < 30) points += 1;
    else points += 3;

    // Waist
    const waistNum = parseFloat(waist);
    if (gender === 'male') {
      if (waistNum < 94) points += 0;
      else if (waistNum < 102) points += 3;
      else points += 4;
    } else {
      if (waistNum < 80) points += 0;
      else if (waistNum < 88) points += 3;
      else points += 4;
    }

    // Physical activity
    if (physicalActivity === 'no') points += 2;

    // Family history
    if (familyHistory) points += 5;

    // Hypertension
    if (hypertension) points += 2;

    let riskLevel, riskText, color;
    if (points < 7) {
      riskLevel = 'დაბალი რისკი';
      riskText = '1 100-დან';
      color = 'success';
    } else if (points < 12) {
      riskLevel = 'ოდნავ გაზრდილი რისკი';
      riskText = '1 25-დან';
      color = 'info';
    } else if (points < 15) {
      riskLevel = 'ზომიერი რისკი';
      riskText = '1 6-დან';
      color = 'warning';
    } else if (points < 20) {
      riskLevel = 'მაღალი რისკი';
      riskText = '1 3-დან';
      color = 'error';
    } else {
      riskLevel = 'ძალიან მაღალი რისკი';
      riskText = '1 2-დან';
      color = 'error';
    }

    setResult({
      points,
      riskLevel,
      riskText,
      color,
    });
  };

  const handleReset = () => {
    setAge('');
    setGender('male');
    setBmi('');
    setWaist('');
    setPhysicalActivity('yes');
    setFamilyHistory(false);
    setHypertension(false);
    setResult(null);
  };

  return (
    <>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mb: 4 }}>
        <Container maxWidth="lg">
          <Button
            component={Link}
            to="/calculators"
            variant="outlined"
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              mb: 2,
              '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.1) }
            }}
          >
            ← უკან კალკულატორებზე
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LocalHospitalIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                დიაბეტის რისკის კალკულატორი
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                ტიპ 2 დიაბეტის განვითარების რისკის შეფასება
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                მონაცემების შეყვანა
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="ასაკი (წლები)"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>სქესი</InputLabel>
                    <Select value={gender} label="სქესი" onChange={(e) => setGender(e.target.value)}>
                      <MenuItem value="male">მამრობითი</MenuItem>
                      <MenuItem value="female">მდედრობითი</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="BMI (kg/m²)"
                    type="number"
                    value={bmi}
                    onChange={(e) => setBmi(e.target.value)}
                    required
                    helperText="გამოიყენეთ BMI კალკულატორი"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="წელის გარშემოწერილობა (სმ)"
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>ფიზიკური აქტივობა</InputLabel>
                    <Select value={physicalActivity} label="ფიზიკური აქტივობა" onChange={(e) => setPhysicalActivity(e.target.value)}>
                      <MenuItem value="yes">დიახ (≥30 წთ/დღე)</MenuItem>
                      <MenuItem value="no">არა</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={familyHistory} onChange={(e) => setFamilyHistory(e.target.checked)} />}
                    label="დიაბეტი ოჯახში (მშობლები, ძმები, დები)"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={hypertension} onChange={(e) => setHypertension(e.target.checked)} />}
                    label="მაღალი არტერიული წნევა (ან მკურნალობა)"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<CalculateIcon />}
                      onClick={calculateRisk}
                    >
                      გამოთვლა
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<RestartAltIcon />}
                      onClick={handleReset}
                    >
                      გასუფთავება
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            {result ? (
              <>
                <Card
                  elevation={4}
                  sx={{
                    background: 'linear-gradient(135deg, #3F51B5 0%, #5C6BC0 100%)',
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    რისკის შეფასება
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Chip
                      label={result.riskLevel}
                      sx={{
                        bgcolor: alpha('#fff', 0.2),
                        color: 'white',
                        fontSize: '1.2rem',
                        py: 3,
                        mb: 2,
                        fontWeight: 'bold',
                      }}
                    />
                    <Typography variant="h6">
                      რისკი: {result.riskText}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                      ქულა: {result.points}
                    </Typography>
                  </Box>
                </Card>

                <Alert severity={result.color} sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    რეკომენდაციები:
                  </Typography>
                  <Typography variant="body2">
                    {result.points < 7 && 'შეინარჩუნეთ ჯანსაღი ცხოვრების წესი და რეგულარულად შეამოწმეთ ჯანმრთელობა.'}
                    {result.points >= 7 && result.points < 12 && 'რეკომენდებულია ცხოვრების წესის გაუმჯობესება და წნევისა და გლუკოზის რეგულარული მონიტორინგი.'}
                    {result.points >= 12 && result.points < 15 && 'გირჩევთ გამოიკვლიოთ სისხლში გლუკოზის დონე და მიმართოთ ენდოკრინოლოგს.'}
                    {result.points >= 15 && 'მაღალი რისკი! აუცილებელია ენდოკრინოლოგთან კონსულტაცია და სისხლში გლუკოზის შემოწმება.'}
                  </Typography>
                </Alert>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    პრევენციის რჩევები
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" component="div">
                    • შეამცირეთ წონა (თუ ჭარბია)<br />
                    • ფიზიკური აქტივობა 30 წუთი დღეში<br />
                    • ჯანსაღი დიეტა (ნაკლები შაქარი და გადამუშავებული საკვები)<br />
                    • რეგულარული ჯანმრთელობის შემოწმება<br />
                    • სტრესის მართვა და საკმარისი ძილი
                  </Typography>
                </Paper>
              </>
            ) : (
              <Paper
                elevation={3}
                sx={{
                  p: 6,
                  borderRadius: 3,
                  textAlign: 'center',
                  minHeight: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box>
                  <LocalHospitalIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    შეავსეთ ველები რისკის შესაფასებლად
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Alert severity="warning">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              გაფრთხილება:
            </Typography>
            <Typography variant="body2">
              ეს კალკულატორი დაფუძნებულია FINDRISC (Finnish Diabetes Risk Score) სკალაზე და ინფორმაციული მიზნებისთვისაა. მაღალი რისკის შემთხვევაში აუცილებელია ექიმთან კონსულტაცია და სისხლში გლუკოზის დონის პროფესიონალური შეფასება.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </>
  );
};

export default DiabetesRiskCalculator;

