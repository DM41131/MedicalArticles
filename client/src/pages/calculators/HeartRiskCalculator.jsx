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
  CardContent,
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
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const HeartRiskCalculator = () => {
  // Input states
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [totalCholesterol, setTotalCholesterol] = useState('');
  const [hdlCholesterol, setHdlCholesterol] = useState('');
  const [systolicBP, setSystolicBP] = useState('');
  const [smoker, setSmoker] = useState(false);
  const [diabetic, setDiabetic] = useState(false);
  const [bpTreated, setBpTreated] = useState(false);
  
  // Result states
  const [result, setResult] = useState(null);

  // Calculate 10-year cardiovascular disease risk (simplified Framingham)
  const calculateRisk = () => {
    if (!age || !totalCholesterol || !hdlCholesterol || !systolicBP) {
      alert('გთხოვთ შეავსოთ ყველა აუცილებელი ველი');
      return;
    }

    const ageNum = parseInt(age);
    const totalChol = parseFloat(totalCholesterol);
    const hdlChol = parseFloat(hdlCholesterol);
    const sbp = parseFloat(systolicBP);

    // Simplified risk calculation based on Framingham Risk Score
    let points = 0;

    // Age points
    if (gender === 'male') {
      if (ageNum >= 20 && ageNum <= 34) points += -9;
      else if (ageNum >= 35 && ageNum <= 39) points += -4;
      else if (ageNum >= 40 && ageNum <= 44) points += 0;
      else if (ageNum >= 45 && ageNum <= 49) points += 3;
      else if (ageNum >= 50 && ageNum <= 54) points += 6;
      else if (ageNum >= 55 && ageNum <= 59) points += 8;
      else if (ageNum >= 60 && ageNum <= 64) points += 10;
      else if (ageNum >= 65 && ageNum <= 69) points += 11;
      else if (ageNum >= 70 && ageNum <= 74) points += 12;
      else if (ageNum >= 75) points += 13;
    } else {
      if (ageNum >= 20 && ageNum <= 34) points += -7;
      else if (ageNum >= 35 && ageNum <= 39) points += -3;
      else if (ageNum >= 40 && ageNum <= 44) points += 0;
      else if (ageNum >= 45 && ageNum <= 49) points += 3;
      else if (ageNum >= 50 && ageNum <= 54) points += 6;
      else if (ageNum >= 55 && ageNum <= 59) points += 8;
      else if (ageNum >= 60 && ageNum <= 64) points += 10;
      else if (ageNum >= 65 && ageNum <= 69) points += 12;
      else if (ageNum >= 70 && ageNum <= 74) points += 14;
      else if (ageNum >= 75) points += 16;
    }

    // Total cholesterol points
    if (totalChol < 160) points += 0;
    else if (totalChol >= 160 && totalChol < 200) points += gender === 'male' ? 4 : 4;
    else if (totalChol >= 200 && totalChol < 240) points += gender === 'male' ? 7 : 8;
    else if (totalChol >= 240 && totalChol < 280) points += gender === 'male' ? 9 : 11;
    else if (totalChol >= 280) points += gender === 'male' ? 11 : 13;

    // HDL cholesterol points
    if (hdlChol >= 60) points += -1;
    else if (hdlChol >= 50 && hdlChol < 60) points += 0;
    else if (hdlChol >= 40 && hdlChol < 50) points += 1;
    else if (hdlChol < 40) points += 2;

    // Blood pressure points
    if (bpTreated) {
      if (sbp < 120) points += 0;
      else if (sbp >= 120 && sbp < 130) points += 1;
      else if (sbp >= 130 && sbp < 140) points += 2;
      else if (sbp >= 140 && sbp < 160) points += 2;
      else if (sbp >= 160) points += 3;
    } else {
      if (sbp < 120) points += 0;
      else if (sbp >= 120 && sbp < 130) points += 0;
      else if (sbp >= 130 && sbp < 140) points += 1;
      else if (sbp >= 140 && sbp < 160) points += 1;
      else if (sbp >= 160) points += 2;
    }

    // Smoking
    if (smoker) points += gender === 'male' ? 4 : 7;

    // Diabetes
    if (diabetic) points += gender === 'male' ? 2 : 3;

    // Convert points to risk percentage (simplified)
    let riskPercent;
    if (points < 0) riskPercent = 1;
    else if (points <= 4) riskPercent = 1;
    else if (points <= 6) riskPercent = 2;
    else if (points <= 8) riskPercent = 4;
    else if (points <= 10) riskPercent = 6;
    else if (points <= 12) riskPercent = 8;
    else if (points <= 14) riskPercent = 10;
    else if (points <= 16) riskPercent = 12;
    else if (points <= 18) riskPercent = 16;
    else if (points <= 20) riskPercent = 20;
    else if (points <= 22) riskPercent = 25;
    else riskPercent = 30;

    setResult({
      riskPercent: riskPercent.toFixed(1),
      points,
      age: ageNum,
    });
  };

  const handleReset = () => {
    setAge('');
    setGender('male');
    setTotalCholesterol('');
    setHdlCholesterol('');
    setSystolicBP('');
    setSmoker(false);
    setDiabetic(false);
    setBpTreated(false);
    setResult(null);
  };

  const getRiskCategory = (risk) => {
    const value = parseFloat(risk);
    if (value < 5) return { text: 'დაბალი რისკი', color: 'success', textEn: 'Low Risk' };
    if (value >= 5 && value < 10) return { text: 'ზომიერი რისკი', color: 'info', textEn: 'Moderate Risk' };
    if (value >= 10 && value < 20) return { text: 'საშუალო რისკი', color: 'warning', textEn: 'Intermediate Risk' };
    return { text: 'მაღალი რისკი', color: 'error', textEn: 'High Risk' };
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
            <FavoriteIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                გულის რისკის კალკულატორი
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                10-წლიანი გულ-სისხლძარღვთა დაავადების რისკი
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ასაკი (წლები)"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
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
                    label="მთლიანი ქოლესტერინი (mg/dL)"
                    type="number"
                    value={totalCholesterol}
                    onChange={(e) => setTotalCholesterol(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="HDL ქოლესტერინი (mg/dL)"
                    type="number"
                    value={hdlCholesterol}
                    onChange={(e) => setHdlCholesterol(e.target.value)}
                    required
                    helperText="კარგი ქოლესტერინი"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="სისტოლური წნევა (mmHg)"
                    type="number"
                    value={systolicBP}
                    onChange={(e) => setSystolicBP(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={bpTreated} onChange={(e) => setBpTreated(e.target.checked)} />}
                    label="მკურნალობს წნევის საწინააღმდეგო პრეპარატებით"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={smoker} onChange={(e) => setSmoker(e.target.checked)} />}
                    label="მწეველი"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={diabetic} onChange={(e) => setDiabetic(e.target.checked)} />}
                    label="დიაბეტი"
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
                    background: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    10-წლიანი რისკი
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h2" fontWeight="bold">
                      {result.riskPercent}%
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Chip
                      label={getRiskCategory(result.riskPercent).text}
                      sx={{
                        bgcolor: alpha('#fff', 0.2),
                        color: 'white',
                        fontSize: '1rem',
                        py: 2.5,
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                </Card>

                <Alert severity={getRiskCategory(result.riskPercent).color} sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    რეკომენდაციები:
                  </Typography>
                  <Typography variant="body2">
                    {parseFloat(result.riskPercent) < 5 && 
                      "შეინარჩუნეთ ჯანსაღი ცხოვრების წესი და რეგულარულად შეამოწმეთ მაჩვენებლები."}
                    {parseFloat(result.riskPercent) >= 5 && parseFloat(result.riskPercent) < 10 && 
                      "რეკომენდებულია ცხოვრების წესის მოდიფიკაცია და რეგულარული მონიტორინგი."}
                    {parseFloat(result.riskPercent) >= 10 && parseFloat(result.riskPercent) < 20 && 
                      "საჭიროა კარდიოლოგის კონსულტაცია და შესაძლოა მედიკამენტური თერაპია."}
                    {parseFloat(result.riskPercent) >= 20 && 
                      "მაღალი რისკი! დაუყოვნებლივ მიმართეთ კარდიოლოგს აქტიური მკურნალობისთვის."}
                  </Typography>
                </Alert>
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
                  <FavoriteIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    შეავსეთ ველები და დააჭირეთ "გამოთვლა" ღილაკს
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            ინფორმაცია
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              რისკის კატეგორიები:
            </Typography>
            <Typography variant="body2">
              • დაბალი რისკი (&lt;5%): ნორმალური რისკი<br />
              • ზომიერი რისკი (5-10%): პრევენციული ზომები<br />
              • საშუალო რისკი (10-20%): მედიკამენტური თერაპია შეიძლება საჭირო იყოს<br />
              • მაღალი რისკი (≥20%): აქტიური მკურნალობა აუცილებელია
            </Typography>
          </Alert>

          <Alert severity="warning">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              გაფრთხილება:
            </Typography>
            <Typography variant="body2">
              ეს კალკულატორი ინფორმაციული მიზნებისთვისაა და დაფუძნებულია Framingham რისკის ქულაზე. არ გამოიყენოთ ის სამედიცინო გადაწყვეტილებების მისაღებად კარდიოლოგთან კონსულტაციის გარეშე.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </>
  );
};

export default HeartRiskCalculator;

