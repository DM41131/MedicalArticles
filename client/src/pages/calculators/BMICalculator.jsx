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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  RestartAlt as RestartAltIcon,
  FitnessCenter as FitnessCenterIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const BMICalculator = () => {
  // Input states
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  
  // Result states
  const [result, setResult] = useState(null);

  // Calculate BMI and BSA
  const calculateBMI = () => {
    // Validate inputs
    if (!weight || !heightCm) {
      alert('გთხოვთ შეავსოთ ყველა ველი');
      return;
    }

    const weightKg = parseFloat(weight);
    const heightInCm = parseFloat(heightCm);
    const heightInMeters = heightInCm / 100;

    // BMI Formula: weight (kg) / height (m)²
    const bmi = weightKg / (heightInMeters * heightInMeters);

    // Body Surface Area (Mosteller formula): √[(height, cm × weight, kg) / 3600]
    const bsa = Math.sqrt((heightInCm * weightKg) / 3600);

    setResult({
      bmi: bmi.toFixed(2),
      bsa: bsa.toFixed(2),
      weight: weightKg,
      height: heightInCm,
    });
  };

  // Reset form
  const handleReset = () => {
    setWeight('');
    setHeightCm('');
    setResult(null);
  };

  // Get BMI Category
  const getBMICategory = (bmi) => {
    const value = parseFloat(bmi);
    if (value < 18.5) return { 
      text: 'დაბალი წონა', 
      textEn: 'Underweight',
      color: 'info',
      risk: 'low' 
    };
    if (value >= 18.5 && value < 25) return { 
      text: 'ნორმალური წონა', 
      textEn: 'Normal weight',
      color: 'success',
      risk: 'normal' 
    };
    if (value >= 25 && value < 30) return { 
      text: 'ზედმეტი წონა', 
      textEn: 'Overweight',
      color: 'warning',
      risk: 'increased' 
    };
    if (value >= 30 && value < 35) return { 
      text: 'სიმსუქნე (კლასი 1)', 
      textEn: 'Obese Class 1',
      color: 'error',
      risk: 'high' 
    };
    if (value >= 35 && value < 40) return { 
      text: 'სიმსუქნე (კლასი 2)', 
      textEn: 'Obese Class 2',
      color: 'error',
      risk: 'very-high' 
    };
    return { 
      text: 'სიმსუქნე (კლასი 3)', 
      textEn: 'Obese Class 3',
      color: 'error',
      risk: 'extremely-high' 
    };
  };

  // Get Asian BMI Category
  const getAsianBMICategory = (bmi) => {
    const value = parseFloat(bmi);
    if (value < 18.5) return { 
      text: 'დაბალი წონა', 
      color: 'info' 
    };
    if (value >= 18.5 && value < 23) return { 
      text: 'ნორმალური წონა', 
      color: 'success' 
    };
    if (value >= 23 && value < 25) return { 
      text: 'ზედმეტი წონა', 
      color: 'warning' 
    };
    return { 
      text: 'სიმსუქნე', 
      color: 'error' 
    };
  };

  const bmiClassificationData = [
    { range: '<18.5', category: 'დაბალი წონა', categoryEn: 'Underweight' },
    { range: '18.5–24.9', category: 'ნორმალური წონა', categoryEn: 'Normal weight' },
    { range: '25.0–29.9', category: 'ზედმეტი წონა', categoryEn: 'Overweight' },
    { range: '30.0–34.9', category: 'სიმსუქნე (კლასი 1)', categoryEn: 'Obese Class 1' },
    { range: '35.0–39.9', category: 'სიმსუქნე (კლასი 2)', categoryEn: 'Obese Class 2' },
    { range: '≥40.0', category: 'სიმსუქნე (კლასი 3)', categoryEn: 'Obese Class 3' },
  ];

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FitnessCenterIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                BMI კალკულატორი
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                სხეულის მასის ინდექსი და სხეულის ზედაპირის ფართობი
              </Typography>
            </Box>
          </Box>
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

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="წონა (კგ)"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    helperText="შეიყვანეთ წონა კილოგრამებში"
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
                    helperText="შეიყვანეთ სიმაღლე სანტიმეტრებში"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<CalculateIcon />}
                      onClick={calculateBMI}
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

          {/* Results Section */}
          <Grid item xs={12} md={6}>
            {result ? (
              <>
                {/* BMI Result */}
                <Card
                  elevation={4}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                    mb: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    სხეულის მასის ინდექსი (BMI)
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h2" fontWeight="bold">
                      {result.bmi}
                    </Typography>
                    <Typography variant="h6">
                      kg/m²
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Chip
                      label={getBMICategory(result.bmi).text}
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

                {/* BSA Result */}
                <Card
                  elevation={4}
                  sx={{
                    background: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    სხეულის ზედაპირის ფართობი (BSA)
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 2 }}>
                    Mosteller Formula
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h2" fontWeight="bold">
                      {result.bsa}
                    </Typography>
                    <Typography variant="h6">
                      m²
                    </Typography>
                  </Box>
                </Card>

                {/* Asian Classification Alert */}
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    აზიელი მოსახლეობისთვის:
                  </Typography>
                  <Typography variant="body2">
                    აზიურ პოპულაციებში სიმსუქნესთან დაკავშირებული გულ-სისხლძარღვთა დაავადების რისკის უფრო ზუსტი შეფასებისთვის, WHO და NIH გვთავაზობენ შემდეგ კლასიფიკაციას:
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      • ზედმეტი წონა: BMI 23–24.9 kg/m²<br />
                      • სიმსუქნე: BMI ≥25 kg/m²
                    </Typography>
                    <Chip
                      label={`აზიური კლასიფიკაცია: ${getAsianBMICategory(result.bmi).text}`}
                      color={getAsianBMICategory(result.bmi).color}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
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
                  <FitnessCenterIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    შეავსეთ ველები და დააჭირეთ "გამოთვლა" ღილაკს
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* BMI Classification Table */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            BMI კლასიფიკაცია
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>BMI (kg/m²)</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>კატეგორია</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category (EN)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bmiClassificationData.map((row, index) => (
                  <TableRow 
                    key={index}
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' },
                      bgcolor: result && parseFloat(result.bmi) >= parseFloat(row.range.split('–')[0] || row.range.replace('≥', '').replace('<', ''))
                        ? alpha('#4CAF50', 0.1)
                        : 'inherit'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{row.range}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.categoryEn}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              შენიშვნა აზიური პოპულაციებისთვის:
            </Typography>
            <Typography variant="body2">
              სტანდარტული კლასიფიკაცია შეიძლება ამცირებდეს სიმსუქნესთან დაკავშირებული გულ-სისხლძარღვთა დაავადების რისკს აზიურ პოპულაციებში. ამიტომ, WHO და NIH რეკომენდაციას უწევს დაბალ BMI ზღვრებს ამ ინდივიდებისთვის:
            </Typography>
            <Box sx={{ mt: 1, pl: 2 }}>
              <Typography variant="body2">
                • <strong>ზედმეტი წონა:</strong> BMI 23–24.9 kg/m²<br />
                • <strong>სიმსუქნე:</strong> BMI ≥25 kg/m²
              </Typography>
            </Box>
          </Alert>
        </Paper>

        {/* Formula Section */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            ფორმულები
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              სხეულის მასის ინდექსი (BMI):
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50', fontFamily: 'monospace' }}>
              BMI (kg/m²) = weight (kg) / [height (m)]²
            </Paper>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              სხეულის ზედაპირის ფართობი (Mosteller Formula):
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50', fontFamily: 'monospace' }}>
              BSA (m²) = √[(height, cm × weight, kg) / 3600]
            </Paper>
          </Box>

          <Alert severity="info">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              რატომ არის მნიშვნელოვანი BMI?
            </Typography>
            <Typography variant="body2">
              სხეულის მასის ინდექსი (BMI) არის სიმაღლესა და წონაზე დაფუძნებული ზომა, რომელიც გამოიყენება სხეულის ზედმეტი ან არასაკმარისი წონის დასადგენად. მიუხედავად იმისა, რომ BMI არ არის პირდაპირი ზომა, ის კარგად კორელირდება სხეულის ცხიმთან და შეიძლება გამოყენებულ იქნას ჯანმრთელობის რისკების შესაფასებლად.
            </Typography>
          </Alert>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              გაფრთხილება:
            </Typography>
            <Typography variant="body2">
              • ეს კალკულატორი ინფორმაციული მიზნებისთვისაა<br />
              • BMI არ აფასებს სხეულის ცხიმის პროცენტს პირდაპირ<br />
              • შეიძლება იყოს არაზუსტი სპორტსმენებისა და მუშაკული ადამიანებისთვის<br />
              • სამედიცინო გადაწყვეტილებების მიღებამდე აუცილებლად გაიარეთ კონსულტაცია ექიმთან
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </>
  );
};

export default BMICalculator;

