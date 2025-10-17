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
  Monitor as MonitorIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const BloodPressureMonitor = () => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [result, setResult] = useState(null);

  const analyzeBP = () => {
    if (!systolic || !diastolic) {
      alert('გთხოვთ შეავსოთ სისტოლური და დიასტოლური წნევა');
      return;
    }

    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);
    const pul = pulse ? parseFloat(pulse) : null;

    let category, categoryGe, color, recommendation;

    if (sys < 120 && dia < 80) {
      category = 'Normal';
      categoryGe = 'ნორმალური';
      color = 'success';
      recommendation = 'თქვენი არტერიული წნევა ნორმალურია. შეინარჩუნეთ ჯანსაღი ცხოვრების წესი.';
    } else if (sys >= 120 && sys < 130 && dia < 80) {
      category = 'Elevated';
      categoryGe = 'ამაღლებული';
      color = 'info';
      recommendation = 'წნევა ოდნავ ამაღლებულია. ყურადღება მიაქციეთ დიეტას და ფიზიკურ აქტივობას.';
    } else if ((sys >= 130 && sys < 140) || (dia >= 80 && dia < 90)) {
      category = 'Hypertension Stage 1';
      categoryGe = 'ჰიპერტენზია სტადია 1';
      color = 'warning';
      recommendation = 'გირჩევთ მიმართოთ ექიმს. შეიძლება საჭირო იყოს ცხოვრების წესის შეცვლა ან მედიკამენტები.';
    } else if ((sys >= 140 && sys < 180) || (dia >= 90 && dia < 120)) {
      category = 'Hypertension Stage 2';
      categoryGe = 'ჰიპერტენზია სტადია 2';
      color = 'error';
      recommendation = 'მაღალი არტერიული წნევა! აუცილებელია ექიმთან კონსულტაცია და მკურნალობა.';
    } else if (sys >= 180 || dia >= 120) {
      category = 'Hypertensive Crisis';
      categoryGe = 'ჰიპერტენზიული კრიზისი';
      color = 'error';
      recommendation = 'საგანგებო მდგომარეობა! დაუყოვნებლივ მიმართეთ სასწრაფო დახმარებას!';
    } else {
      category = 'Hypotension';
      categoryGe = 'ჰიპოტენზია';
      color = 'info';
      recommendation = 'დაბალი არტერიული წნევა. თუ გაქვთ სიმპტომები, მიმართეთ ექიმს.';
    }

    // Pulse analysis
    let pulseStatus = null;
    if (pul) {
      if (pul < 60) {
        pulseStatus = { text: 'ბრადიკარდია (დაბალი პულსი)', color: 'info' };
      } else if (pul >= 60 && pul <= 100) {
        pulseStatus = { text: 'ნორმალური პულსი', color: 'success' };
      } else {
        pulseStatus = { text: 'ტაქიკარდია (მაღალი პულსი)', color: 'warning' };
      }
    }

    // Mean Arterial Pressure (MAP)
    const map = (dia + (sys - dia) / 3).toFixed(1);

    // Pulse Pressure
    const pulsePressure = (sys - dia).toFixed(0);

    setResult({
      systolic: sys,
      diastolic: dia,
      pulse: pul,
      category,
      categoryGe,
      color,
      recommendation,
      pulseStatus,
      map,
      pulsePressure,
    });
  };

  const handleReset = () => {
    setSystolic('');
    setDiastolic('');
    setPulse('');
    setResult(null);
  };

  const bpClassification = [
    { category: 'ნორმალური', categoryEn: 'Normal', systolic: '<120', diastolic: 'და <80', color: '#4CAF50' },
    { category: 'ამაღლებული', categoryEn: 'Elevated', systolic: '120-129', diastolic: 'და <80', color: '#2196F3' },
    { category: 'ჰიპერტენზია სტადია 1', categoryEn: 'Hypertension Stage 1', systolic: '130-139', diastolic: 'ან 80-89', color: '#FF9800' },
    { category: 'ჰიპერტენზია სტადია 2', categoryEn: 'Hypertension Stage 2', systolic: '140-179', diastolic: 'ან 90-119', color: '#F44336' },
    { category: 'ჰიპერტენზიული კრიზისი', categoryEn: 'Hypertensive Crisis', systolic: '≥180', diastolic: 'ან ≥120', color: '#D32F2F' },
  ];

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
            <MonitorIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                არტერიული წნევის მონიტორი
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                სისხლის წნევის ანალიზი და კატეგორიზაცია
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
                წნევის მაჩვენებლები
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="სისტოლური წნევა (mmHg)"
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    required
                    helperText="ზედა მაჩვენებელი"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="დიასტოლური წნევა (mmHg)"
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    required
                    helperText="ქვედა მაჩვენებელი"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="პულსი (დარტყმა/წუთში)"
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    helperText="არასავალდებულო"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<CalculateIcon />}
                      onClick={analyzeBP}
                    >
                      ანალიზი
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
                    background: `linear-gradient(135deg, ${
                      result.color === 'success' ? '#4CAF50' :
                      result.color === 'info' ? '#2196F3' :
                      result.color === 'warning' ? '#FF9800' : '#F44336'
                    } 0%, ${alpha(
                      result.color === 'success' ? '#4CAF50' :
                      result.color === 'info' ? '#2196F3' :
                      result.color === 'warning' ? '#FF9800' : '#F44336', 0.7
                    )} 100%)`,
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
                      {result.systolic}/{result.diastolic}
                    </Typography>
                    <Typography variant="h6">
                      mmHg
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Chip
                      label={result.categoryGe}
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

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    დამატებითი მაჩვენებლები
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ '& > div': { mb: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">საშუალო არტერიული წნევა (MAP):</Typography>
                      <Typography fontWeight="bold">{result.map} mmHg</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">პულსური წნევა:</Typography>
                      <Typography fontWeight="bold">{result.pulsePressure} mmHg</Typography>
                    </Box>
                    {result.pulse && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography color="text.secondary">პულსი:</Typography>
                        <Box>
                          <Typography fontWeight="bold" component="span">{result.pulse} bpm </Typography>
                          <Chip 
                            label={result.pulseStatus.text}
                            color={result.pulseStatus.color}
                            size="small"
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Paper>

                <Alert severity={result.color} sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    რეკომენდაცია:
                  </Typography>
                  <Typography variant="body2">
                    {result.recommendation}
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
                  <MonitorIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    შეიყვანეთ მაჩვენებლები ანალიზისთვის
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            არტერიული წნევის კლასიფიკაცია (AHA/ACC)
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>კატეგორია</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>სისტოლური</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>დიასტოლური</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bpClassification.map((row, index) => (
                  <TableRow key={index} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: row.color }} />
                        <Typography fontWeight={600}>{row.category}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">{row.categoryEn}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.systolic}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.diastolic}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              როგორ გავზომოთ სწორად:
            </Typography>
            <Typography variant="body2">
              • იჯექით მშვიდად 5 წუთის განმავლობაში გაზომვამდე<br />
              • გამოიყენეთ მკლავბანდი სწორ ზომაზე<br />
              • მკლავი უნდა ეყრდნობოდეს მაგიდას გულის დონეზე<br />
              • არ ილაპარაკოთ გაზომვისას<br />
              • აიღეთ 2-3 მაჩვენებელი და გამოთვალეთ საშუალო
            </Typography>
          </Alert>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              გაფრთხილება:
            </Typography>
            <Typography variant="body2">
              ეს კალკულატორი ინფორმაციული მიზნებისთვისაა. ერთჯერადი მაღალი მაჩვენებელი არ ნიშნავს ჰიპერტენზიის დიაგნოზს. რეგულარულად შეამოწმეთ წნევა და მიმართეთ ექიმს სამედიცინო რჩევისთვის.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </>
  );
};

export default BloodPressureMonitor;

