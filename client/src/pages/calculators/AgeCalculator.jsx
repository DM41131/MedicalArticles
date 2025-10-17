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
  alpha,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  RestartAlt as RestartAltIcon,
  Cake as CakeIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [result, setResult] = useState(null);

  const calculateAge = () => {
    if (!birthDate) {
      alert('გთხოვთ შეიყვანოთ დაბადების თარიღი');
      return;
    }

    const birth = new Date(birthDate);
    const target = targetDate ? new Date(targetDate) : new Date();

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((target - birth) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next birthday
    let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < target) {
      nextBirthday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.floor((nextBirthday - target) / (1000 * 60 * 60 * 24));

    // Day of week born
    const daysOfWeek = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
    const dayOfWeekBorn = daysOfWeek[birth.getDay()];

    // Zodiac sign
    const zodiacSigns = [
      { name: 'თხის რქა', start: [12, 22], end: [1, 19] },
      { name: 'მერწყული', start: [1, 20], end: [2, 18] },
      { name: 'თევზები', start: [2, 19], end: [3, 20] },
      { name: 'ვერძი', start: [3, 21], end: [4, 19] },
      { name: 'კურო', start: [4, 20], end: [5, 20] },
      { name: 'ტყუპები', start: [5, 21], end: [6, 20] },
      { name: 'კირჩხიბი', start: [6, 21], end: [7, 22] },
      { name: 'ლომი', start: [7, 23], end: [8, 22] },
      { name: 'ქალწული', start: [8, 23], end: [9, 22] },
      { name: 'სასწორი', start: [9, 23], end: [10, 22] },
      { name: 'მორიელი', start: [10, 23], end: [11, 21] },
      { name: 'მშვილდოსანი', start: [11, 22], end: [12, 21] },
    ];

    const birthMonth = birth.getMonth() + 1;
    const birthDay = birth.getDate();
    let zodiacSign = '';

    for (const sign of zodiacSigns) {
      if (
        (birthMonth === sign.start[0] && birthDay >= sign.start[1]) ||
        (birthMonth === sign.end[0] && birthDay <= sign.end[1])
      ) {
        zodiacSign = sign.name;
        break;
      }
    }

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      daysUntilBirthday,
      dayOfWeekBorn,
      zodiacSign,
    });
  };

  const handleReset = () => {
    setBirthDate('');
    setTargetDate('');
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
            <CakeIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                ასაკის კალკულატორი
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                ზუსტი ასაკის გამოთვლა წლებში, თვებსა და დღეებში
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

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="დაბადების თარიღი"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="მიზნობრივი თარიღი (არასავალდებულო)"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    helperText="ცარიელად დატოვება = დღევანდელი თარიღი"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<CalculateIcon />}
                      onClick={calculateAge}
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
                    background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    თქვენი ასაკი
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h2" fontWeight="bold">
                      {result.years}
                    </Typography>
                    <Typography variant="h5">
                      წელი, {result.months} თვე, {result.days} დღე
                    </Typography>
                  </Box>
                </Card>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    დეტალური ინფორმაცია
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white', textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold">{result.totalMonths}</Typography>
                        <Typography variant="body2">სულ თვე</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'white', textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold">{result.totalWeeks}</Typography>
                        <Typography variant="body2">სულ კვირა</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'white', textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold">{result.totalDays}</Typography>
                        <Typography variant="body2">სულ დღე</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'white', textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold">{result.totalHours.toLocaleString()}</Typography>
                        <Typography variant="body2">სულ საათი</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    საინტერესო ფაქტები
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ '& > div': { mb: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">დაბადების დღე:</Typography>
                      <Typography fontWeight="bold">{result.dayOfWeekBorn}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">ზოდიაქოს ნიშანი:</Typography>
                      <Typography fontWeight="bold">{result.zodiacSign}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">დღემდე დაბადების დღემდე:</Typography>
                      <Typography fontWeight="bold">{result.daysUntilBirthday} დღე</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">ცხოვრების წუთები:</Typography>
                      <Typography fontWeight="bold">{result.totalMinutes.toLocaleString()}</Typography>
                    </Box>
                  </Box>
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
                  <CakeIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    შეიყვანეთ დაბადების თარიღი ასაკის გამოსათვლელად
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AgeCalculator;

