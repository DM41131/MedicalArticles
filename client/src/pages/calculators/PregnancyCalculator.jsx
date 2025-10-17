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
  alpha,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  RestartAlt as RestartAltIcon,
  ChildCare as ChildCareIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const PregnancyCalculator = () => {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [result, setResult] = useState(null);

  const calculatePregnancy = () => {
    if (!lastPeriod) {
      alert('გთხოვთ შეიყვანოთ ბოლო მენსტრუაციის პირველი დღე');
      return;
    }

    const lmp = new Date(lastPeriod);
    const cycle = parseInt(cycleLength) || 28;
    const today = new Date();

    // Naegele's rule: LMP + 280 days
    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280 + (cycle - 28));

    // Conception date (approximately 14 days after LMP)
    const conceptionDate = new Date(lmp);
    conceptionDate.setDate(conceptionDate.getDate() + 14);

    // Current gestational age
    const daysSinceLMP = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(daysSinceLMP / 7);
    const days = daysSinceLMP % 7;
    const trimester = weeks < 13 ? 1 : weeks < 27 ? 2 : 3;

    // Days until due date
    const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

    // Key milestones
    const milestones = [
      { week: 12, event: 'პირველი ტრიმესტრის დასასრული' },
      { week: 20, event: 'შუა ორსულობა, ბავშვის მოძრაობები' },
      { week: 27, event: 'მესამე ტრიმესტრის დაწყება' },
      { week: 37, event: 'სრული ვადა (მზად შობისთვის)' },
      { week: 40, event: 'მოსალოდნელი მშობიარობის თარიღი' },
    ];

    const upcomingMilestones = milestones.filter(m => m.week > weeks).slice(0, 3);

    setResult({
      dueDate: dueDate.toLocaleDateString('ka-GE', { year: 'numeric', month: 'long', day: 'numeric' }),
      conceptionDate: conceptionDate.toLocaleDateString('ka-GE', { year: 'numeric', month: 'long', day: 'numeric' }),
      weeks,
      days,
      trimester,
      daysUntilDue,
      upcomingMilestones,
      totalWeeks: Math.floor(daysUntilDue / 7) + weeks,
    });
  };

  const handleReset = () => {
    setLastPeriod('');
    setCycleLength('28');
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
            <ChildCareIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                ორსულობის კალკულატორი
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                მშობიარობის თარიღისა და ორსულობის ვადის გამოთვლა
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
                    label="ბოლო მენსტრუაციის პირველი დღე"
                    type="date"
                    value={lastPeriod}
                    onChange={(e) => setLastPeriod(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ციკლის ხანგრძლივობა (დღეებში)"
                    type="number"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                    helperText="საშუალოდ 28 დღე"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<CalculateIcon />}
                      onClick={calculatePregnancy}
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
                    background: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)',
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    მოსალოდნელი მშობიარობის თარიღი
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {result.dueDate}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">
                      {result.daysUntilDue > 0 ? `${result.daysUntilDue} დღე დარჩა` : 'ვადა გავიდა'}
                    </Typography>
                  </Box>
                </Card>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    ორსულობის ვადა
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white', textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="bold">{result.weeks}</Typography>
                        <Typography variant="body2">კვირა</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'white', textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="bold">{result.days}</Typography>
                        <Typography variant="body2">დღე</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {result.trimester}-ლი ტრიმესტრი
                    </Typography>
                  </Box>
                </Paper>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    მნიშვნელოვანი თარიღები
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ '& > div': { mb: 1 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">განაყოფიერების თარიღი:</Typography>
                      <Typography fontWeight="bold">{result.conceptionDate}</Typography>
                    </Box>
                  </Box>
                </Paper>

                {result.upcomingMilestones.length > 0 && (
                  <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      მოახლოებული ეტაპები
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                      {result.upcomingMilestones.map((milestone, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`კვირა ${milestone.week}`}
                            secondary={milestone.event}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    გახსოვდეთ: მშობიარობის თარიღი არის მიახლოებითი. მხოლოდ 5% ქალი სძენს ზუსტად გამოთვლილ თარიღზე. ნორმალურია დაბადება ±2 კვირით.
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
                  <ChildCareIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    შეიყვანეთ ბოლო მენსტრუაციის თარიღი
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
              Naegele-ს წესი:
            </Typography>
            <Typography variant="body2">
              მშობიარობის თარიღი გამოითვლება ბოლო მენსტრუაციის პირველი დღიდან 280 დღის (40 კვირის) დამატებით. ეს არის სტანდარტული მეთოდი აკუშერებში.
            </Typography>
          </Alert>

          <Alert severity="warning">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              გაფრთხილება:
            </Typography>
            <Typography variant="body2">
              ეს კალკულატორი ინფორმაციული მიზნებისთვისაა. ზუსტი გესტაციური ასაკი და მშობიარობის თარიღი უნდა დადასტურდეს ექიმის მიერ ულტრაბგერით. რეგულარულად დაესწარით პრენატალურ ვიზიტებს.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </>
  );
};

export default PregnancyCalculator;

