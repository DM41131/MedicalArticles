import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Alert,
  Chip,
  alpha,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  RestartAlt as RestartAltIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const CreatinineClearance = () => {
  // Input states
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [creatinine, setCreatinine] = useState('');
  
  // Result states
  const [result, setResult] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [ibw, setIbw] = useState(null);
  const [abw, setAbw] = useState(null);
  const [weightCategory, setWeightCategory] = useState('');

  // Calculate BMI
  const calculateBMI = (weightKg, heightCm) => {
    if (!weightKg || !heightCm) return null;
    const heightMeters = heightCm / 100;
    return (weightKg / (heightMeters * heightMeters)).toFixed(2);
  };

  // Calculate Ideal Body Weight (IBW) using Devine equation
  const calculateIBW = (gender, heightCm) => {
    if (!heightCm) return null;
    
    // Convert cm to inches for Devine equation
    const heightInches = heightCm / 2.54;
    
    if (gender === 'male') {
      return 50 + (2.3 * (heightInches - 60));
    } else {
      return 45.5 + (2.3 * (heightInches - 60));
    }
  };

  // Calculate Adjusted Body Weight (ABW)
  const calculateABW = (ibw, actualWeight) => {
    if (!ibw || !actualWeight) return null;
    return ibw + 0.4 * (actualWeight - ibw);
  };

  // Get weight category based on BMI
  const getWeightCategory = (bmi) => {
    if (bmi < 18.5) return 'underweight';
    if (bmi >= 18.5 && bmi < 25) return 'normal';
    return 'overweight';
  };

  // Calculate Creatinine Clearance
  const calculateCrCl = () => {
    // Validate inputs
    if (!age || !weight || !heightCm || !creatinine) {
      alert('გთხოვთ შეავსოთ ყველა აუცილებელი ველი');
      return;
    }

    const heightInCm = parseFloat(heightCm);
    const weightKg = parseFloat(weight);
    const ageYears = parseInt(age);
    const crMgDl = parseFloat(creatinine);

    // Calculate BMI
    const calculatedBmi = parseFloat(calculateBMI(weightKg, heightInCm));
    setBmi(calculatedBmi);

    // Calculate IBW
    const calculatedIbw = calculateIBW(gender, heightInCm);
    setIbw(calculatedIbw);

    // Calculate ABW
    const calculatedAbw = calculateABW(calculatedIbw, weightKg);
    setAbw(calculatedAbw);

    // Determine weight category
    const category = getWeightCategory(calculatedBmi);
    setWeightCategory(category);

    // Determine which weight to use for calculation
    let weightForCalculation;
    let weightForRange;
    
    if (category === 'underweight') {
      // Use actual body weight
      weightForCalculation = weightKg;
      weightForRange = weightKg;
    } else if (category === 'normal') {
      // Use ideal body weight for calculation, actual for range
      weightForCalculation = calculatedIbw;
      weightForRange = weightKg;
    } else {
      // Overweight/obese: Use adjusted body weight for calculation, ideal for range
      weightForCalculation = calculatedAbw;
      weightForRange = calculatedIbw;
    }

    // Cockcroft-Gault formula
    const genderMultiplier = gender === 'female' ? 0.85 : 1;
    const crCl = ((140 - ageYears) * weightForCalculation * genderMultiplier) / (72 * crMgDl);
    
    // Calculate range if different weight is used
    let crClRange = null;
    if (weightForCalculation !== weightForRange) {
      crClRange = ((140 - ageYears) * weightForRange * genderMultiplier) / (72 * crMgDl);
    }

    setResult({
      crCl: crCl.toFixed(2),
      crClRange: crClRange ? crClRange.toFixed(2) : null,
      weightUsed: weightForCalculation.toFixed(2),
      rangeWeightUsed: weightForRange ? weightForRange.toFixed(2) : null,
    });
  };

  // Reset form
  const handleReset = () => {
    setAge('');
    setGender('male');
    setWeight('');
    setHeightCm('');
    setCreatinine('');
    setResult(null);
    setBmi(null);
    setIbw(null);
    setAbw(null);
    setWeightCategory('');
  };

  // Interpretation
  const getInterpretation = (crCl) => {
    const value = parseFloat(crCl);
    if (value >= 90) return { text: 'ნორმალური', color: 'success' };
    if (value >= 60) return { text: 'მსუბუქი შემცირება', color: 'info' };
    if (value >= 30) return { text: 'ზომიერი შემცირება', color: 'warning' };
    if (value >= 15) return { text: 'მძიმე შემცირება', color: 'error' };
    return { text: 'თირკმლის უკმარისობა', color: 'error' };
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 6,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Button
            component={Link}
            to="/calculators"
            variant="outlined"
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              mb: 2,
              '&:hover': {
                borderColor: 'white',
                bgcolor: alpha('#fff', 0.1),
              }
            }}
          >
            ← უკან კალკულატორებზე
          </Button>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            კრეატინინის კლირენსის კალკულატორი
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Cockcroft-Gault Equation
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Input Section */}
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
                    <Select
                      value={gender}
                      label="სქესი"
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <MenuItem value="male">მამრობითი</MenuItem>
                      <MenuItem value="female">მდედრობითი</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="წონა (კგ)"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="სიმაღლე (სმ)"
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    required
                    helperText="სიმაღლე სანტიმეტრებში"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="კრეატინინი (mg/dL)"
                    type="number"
                    value={creatinine}
                    onChange={(e) => setCreatinine(e.target.value)}
                    required
                    helperText="შრატის კრეატინინის დონე"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<CalculateIcon />}
                      onClick={calculateCrCl}
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

            {/* Body Metrics Display */}
            {(bmi || ibw || abw) && (
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  სხეულის მეტრიკა
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {bmi && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>BMI:</Typography>
                        <Typography fontWeight="bold">{bmi}</Typography>
                      </Box>
                      <Chip 
                        label={
                          weightCategory === 'underweight' ? 'დაბალი წონა' :
                          weightCategory === 'normal' ? 'ნორმალური წონა' :
                          'ზედმეტი წონა/სიმსუქნე'
                        }
                        size="small"
                        color={
                          weightCategory === 'underweight' ? 'warning' :
                          weightCategory === 'normal' ? 'success' :
                          'error'
                        }
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                  )}
                  {ibw && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>იდეალური წონა (IBW):</Typography>
                        <Typography fontWeight="bold">{ibw.toFixed(2)} კგ</Typography>
                      </Box>
                    </Grid>
                  )}
                  {abw && weightCategory === 'overweight' && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>მორგებული წონა (ABW):</Typography>
                        <Typography fontWeight="bold">{abw.toFixed(2)} კგ</Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}
          </Grid>

          {/* Results Section */}
          <Grid item xs={12} md={6}>
            {result ? (
              <>
                <Card
                  elevation={4}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    შედეგი
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h2" fontWeight="bold">
                      {result.crCl}
                    </Typography>
                    <Typography variant="h6">
                      mL/min
                    </Typography>
                    {result.crClRange && (
                      <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                        დიაპაზონი: {result.crClRange} mL/min
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Chip
                      label={getInterpretation(result.crCl).text}
                      sx={{
                        bgcolor: alpha('#fff', 0.2),
                        color: 'white',
                        fontSize: '1rem',
                        py: 2.5,
                      }}
                    />
                  </Box>
                </Card>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    გამოთვლის დეტალები
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ '& > div': { mb: 1 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">გამოყენებული წონა:</Typography>
                      <Typography fontWeight="bold">{result.weightUsed} კგ</Typography>
                    </Box>
                    {result.rangeWeightUsed && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">დიაპაზონის წონა:</Typography>
                        <Typography fontWeight="bold">{result.rangeWeightUsed} კგ</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">წონის კატეგორია:</Typography>
                      <Typography fontWeight="bold">
                        {weightCategory === 'underweight' && 'დაბალი (ფაქტობრივი წონა)'}
                        {weightCategory === 'normal' && 'ნორმალური (იდეალური წონა)'}
                        {weightCategory === 'overweight' && 'ზედმეტი (მორგებული წონა)'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Interpretation Guide */}
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    ინტერპრეტაცია:
                  </Typography>
                  <Typography variant="body2" component="div">
                    • ≥90 mL/min: ნორმალური<br />
                    • 60-89 mL/min: მსუბუქი შემცირება<br />
                    • 30-59 mL/min: ზომიერი შემცირება<br />
                    • 15-29 mL/min: მძიმე შემცირება<br />
                    • &lt;15 mL/min: თირკმლის უკმარისობა
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
                  <CalculateIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    შეავსეთ ყველა ველი და დააჭირეთ "გამოთვლა" ღილაკს
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* Formula and Info Section */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            ფორმულა და ინფორმაცია
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cockcroft-Gault ფორმულა:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50', fontFamily: 'monospace' }}>
              CrCl (mL/min) = (140 – age) × (weight, kg) × (0.85 if female) / (72 × Cr, mg/dL)
            </Paper>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              იდეალური წონის გამოთვლა (Devine):
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50', fontFamily: 'monospace' }}>
              IBW (male) = 50 + [2.3 × (height, inches – 60)]<br />
              IBW (female) = 45.5 + [2.3 × (height, inches – 60)]<br />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                * სიმაღლე სმ-დან გადაყვანილია დუიმებში (1 დუიმი = 2.54 სმ)
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              მორგებული წონის გამოთვლა:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50', fontFamily: 'monospace' }}>
              ABW = IBW + 0.4 × (actual body weight – IBW)
            </Paper>
          </Box>

          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              მნიშვნელოვანი შენიშვნები:
            </Typography>
            <Typography variant="body2">
              • Cockcroft-Gault ფორმულა აფასებს კრეატინინის კლირენსს GFR-ის დაახლოებით განსაზღვრისთვის<br />
              • კრეატინინის კლირენსი შეიძლება გადააფასებდეს GFR-ს 10-20%-ით<br />
              • ფორმულა ნაკლებად ზუსტია წონის ექსტრემულ შემთხვევებში<br />
              • ეს კალკულატორი არის ინფორმაციული ხასიათის და არ ცვლის პროფესიონალ სამედიცინო კონსულტაციას
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </>
  );
};

export default CreatinineClearance;

