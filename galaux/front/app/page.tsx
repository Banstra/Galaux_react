// // В React/Electron компоненте
// import * as msmc from 'msmc';
//
// async function loginWithMicrosoft() {
//   // Инициализация flow (для Electron используется 'electron' или 'popup')
//   const flow = msmc.quickLogin('react');
//
//   try {
//     const result = await flow();
//
//     if (result.type === 'Success') {
//       const mcToken = result.minecraft_token;
//       const mcProfile = result.profile; // { id: 'uuid', name: 'Steve' }
//
//       // Отправляем токен на твой NestJS бэкенд
//       const response = await fetch('http://localhost:3000/auth/microsoft', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           accessToken: mcToken,
//           uuid: mcProfile.id,
//           username: mcProfile.name,
//         }),
//       });
//
//       const galauxSession = await response.json();
//       // Сохраняем galauxSession.token в localStorage/БД лаунчера
//     }
//   } catch (error) {
//     console.error('Ошибка входа', error);
//   }
// }
