import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  alpha,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MentalHealthAssessment = () => {
  const [answers, setAnswers] = useState({});

  const questions = [
    'თავს ხშირად შეუძლებლად ვგრძნობ',
    'მიჭირს რაიმეზე კონცენტრირება',
    'ვგრძნობ უსიამოვნებას ჩემი ცხოვრების უმეტეს ნაწილში',
    'ძილის პრობლემები მაქვს',
    'მომავალზე ფიქრი მაწუხებს',
  ];

  const options = [
    { value: 0, label: 'არასოდეს' },
    { value: 1, label: 'ზოგჯერ' },
    { value: 2, label: 'ხშირად' },
    { value: 3, label: 'თითქმის ყოველთვის' },
  ];

  const handleChange = (questionIndex, value) => {
    setAnswers({ ...answers, [questionIndex]: parseInt(value) });
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, val) => sum + val, 0);
  };

  const getResult = () => {
    const score = calculateScore();
    if (score < 5) return { level: 'მსუბუქი', color: 'success', text: 'თქვენი მენტალური მდგომარეობა კარგია. განაგრძეთ ჯანსაღი ცხოვრების წესი.' };
    if (score < 10) return { level: 'ზომიერი', color: 'warning', text: 'შეიძლება გამოგადგებათ სტრესის მართვის ტექნიკები. განიხილეთ ფსიქოლოგთან კონსულტაცია.' };
    return { level: 'მძიმე', color: 'error', text: 'გირჩევთ მიმართოთ ფსიქოლოგს ან ფსიქიატრს პროფესიონალური დახმარებისთვის.' };
  };

  const allAnswered = Object.keys(answers).length === questions.length;

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
            <PsychologyIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                ფსიქიკური ჯანმრთელობის შეფასება
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                მარტივი სკრინინგის ტესტი
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            ეს არის მარტივი თვითშეფასების ტესტი. ის არ ცვლის პროფესიონალურ დიაგნოზს. თუ განიცდით სერიოზულ სიმპტომებს, აუცილებლად მიმართეთ სპეციალისტს.
          </Typography>
        </Alert>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            გთხოვთ, უპასუხოთ შემდეგ კითხვებს
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            გაიხსენეთ ბოლო 2 კვირა
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {questions.map((question, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {index + 1}. {question}
              </Typography>
              <RadioGroup
                value={answers[index] ?? ''}
                onChange={(e) => handleChange(index, e.target.value)}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            </Box>
          ))}
        </Paper>

        {allAnswered && (
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              შედეგი
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h2" color="primary" fontWeight="bold">
                {calculateScore()}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                ქულა 15-დან
              </Typography>
            </Box>
            <Alert severity={getResult().color}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {getResult().level} დონე
              </Typography>
              <Typography variant="body2">
                {getResult().text}
              </Typography>
            </Alert>
          </Paper>
        )}

        <Alert severity="error" sx={{ mt: 4 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            გადაუდებელი დახმარება:
          </Typography>
          <Typography variant="body2">
            თუ გაქვთ თვითმკვლელობის ფიქრები ან დაუყოვნებელი დახმარება გჭირდებათ:<br />
            • გადაუდებლობის ნომერი: 112<br />
            • კრიზისის ცხელი ხაზი: 116 006<br />
            • ფსიქიატრიული გადაუდებელი დახმარება: დაუყოვნებლივ მიმართეთ უახლოეს საავადმყოფოს
          </Typography>
        </Alert>
      </Container>
    </>
  );
};

export default MentalHealthAssessment;

