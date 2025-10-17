import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  alpha,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Vaccines as VaccinesIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const VaccinationSchedule = () => {
  const [birthDate, setBirthDate] = useState('');
  const [upcomingVaccines, setUpcomingVaccines] = useState([]);

  const vaccineSchedule = [
    { age: '0 დღე', vaccine: 'ჰეპატიტი B (1-ლი დოზა)', disease: 'ჰეპატიტი B' },
    { age: '0 დღე', vaccine: 'BCG', disease: 'ტუბერკულოზი' },
    { age: '2 თვე', vaccine: 'DTP (1-ლი დოზა)', disease: 'დიფთერია, ტეტანუსი, კუჭ-ყელის ხველა' },
    { age: '2 თვე', vaccine: 'პოლიო (1-ლი დოზა)', disease: 'პოლიომიელიტი' },
    { age: '2 თვე', vaccine: 'ჰემოფილუს (1-ლი დოზა)', disease: 'ჰემოფილუს ინფექცია' },
    { age: '2 თვე', vaccine: 'ჰეპატიტი B (2-ე დოზა)', disease: 'ჰეპატიტი B' },
    { age: '4 თვე', vaccine: 'DTP (2-ე დოზა)', disease: 'დიფთერია, ტეტანუსი, კუჭ-ყელის ხველა' },
    { age: '4 თვე', vaccine: 'პოლიო (2-ე დოზა)', disease: 'პოლიომიელიტი' },
    { age: '4 თვე', vaccine: 'ჰემოფილუს (2-ე დოზა)', disease: 'ჰემოფილუს ინფექცია' },
    { age: '6 თვე', vaccine: 'DTP (3-ე დოზა)', disease: 'დიფთერია, ტეტანუსი, კუჭ-ყელის ხველა' },
    { age: '6 თვე', vaccine: 'პოლიო (3-ე დოზა)', disease: 'პოლიომიელიტი' },
    { age: '6 თვე', vaccine: 'ჰემოფილუს (3-ე დოზა)', disease: 'ჰემოფილუს ინფექცია' },
    { age: '6 თვე', vaccine: 'ჰეპატიტი B (3-ე დოზა)', disease: 'ჰეპატიტი B' },
    { age: '12 თვე', vaccine: 'წითურა, წითურას და პაროტიტი (MMR)', disease: 'წითურა, წითურას, პაროტიტი' },
    { age: '18 თვე', vaccine: 'DTP (4-ე დოზა)', disease: 'დიფთერია, ტეტანუსი, კუჭ-ყელის ხველა' },
    { age: '18 თვე', vaccine: 'პოლიო (4-ე დოზა)', disease: 'პოლიომიელიტი' },
    { age: '6 წელი', vaccine: 'DTP (5-ე დოზა)', disease: 'დიფთერია, ტეტანუსი, კუჭ-ყელის ხველა' },
    { age: '6 წელი', vaccine: 'MMR (2-ე დოზა)', disease: 'წითურა, წითურას, პაროტიტი' },
    { age: '14 წელი', vaccine: 'Td (გამაძლიერებელი)', disease: 'დიფთერია, ტეტანუსი' },
  ];

  const calculateSchedule = () => {
    if (!birthDate) {
      alert('გთხოვთ შეიყვანოთ დაბადების თარიღი');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    
    const ageMonths = Math.floor((today - birth) / (1000 * 60 * 60 * 24 * 30.44));
    const ageYears = Math.floor(ageMonths / 12);

    const upcoming = vaccineSchedule.filter((vaccine) => {
      if (vaccine.age.includes('დღე')) return false;
      if (vaccine.age.includes('თვე')) {
        const months = parseInt(vaccine.age);
        return months > ageMonths && months <= ageMonths + 6;
      }
      if (vaccine.age.includes('წელი')) {
        const years = parseInt(vaccine.age);
        return years > ageYears && years <= ageYears + 2;
      }
      return false;
    });

    setUpcomingVaccines(upcoming);
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
            <VaccinesIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                ვაქცინაციის განრიგი
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                ბავშვების ვაქცინაციის ეროვნული კალენდარი (საქართველო)
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            ეს განრიგი დაფუძნებულია საქართველოს ვაქცინაციის ეროვნულ კალენდარზე. ზუსტი თარიღებისთვის მიმართეთ თქვენს პედიატრს.
          </Typography>
        </Alert>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            განსაზღვრეთ მომავალი ვაქცინები
          </Typography>
          <Box sx={{ mt: 3, maxWidth: 400 }}>
            <TextField
              fullWidth
              label="ბავშვის დაბადების თარიღი"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={calculateSchedule}
            >
              მომავალი ვაქცინების ნახვა
            </Button>
          </Box>
        </Paper>

        {upcomingVaccines.length > 0 && (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              მომავალი ვაქცინები
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ასაკი</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ვაქცინა</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>დაცვა</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcomingVaccines.map((vaccine, index) => (
                    <TableRow key={index}>
                      <TableCell>{vaccine.age}</TableCell>
                      <TableCell>{vaccine.vaccine}</TableCell>
                      <TableCell>{vaccine.disease}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            სრული ვაქცინაციის განრიგი
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ასაკი</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ვაქცინა</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>რისგან იცავს</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vaccineSchedule.map((vaccine, index) => (
                  <TableRow key={index} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell>
                      <Chip label={vaccine.age} size="small" color="primary" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{vaccine.vaccine}</TableCell>
                    <TableCell>{vaccine.disease}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Alert severity="warning" sx={{ mt: 4 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            მნიშვნელოვანი:
          </Typography>
          <Typography variant="body2">
            • ვაქცინები უსაფრთხო და ეფექტურია<br />
            • დაიცავით განრიგი ბავშვის სრული დაცვისთვის<br />
            • გამოტოვებული ვაქცინები შეიძლება მოგვიანებით ჩატარდეს<br />
            • მიმართეთ პედიატრს კითხვების შემთხვევაში<br />
            • ვაქცინაცია უფასოა ყველა ბავშვისთვის საქართველოში
          </Typography>
        </Alert>
      </Container>
    </>
  );
};

export default VaccinationSchedule;

