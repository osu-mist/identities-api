const fakeIdentitiesTestCases = [
  [
    {
      firstName: 'Harry',
      middleName: 'James',
      lastName: 'Potter',
      osuId: '123456789',
      onid: 'potterharry2000',
      osuUid: '1234567890',
      proxId: '1234-1234567',
    },
    {
      firstName: 'Tom',
      middleName: 'Marvolo',
      lastName: 'Riddle',
      osuId: '987654321',
      onid: 'voldemort',
      osuUid: '0123456789',
      proxId: '5678-7654321',
    },
  ],
  [
    {
      firstName: 'Severus',
      middleName: null,
      lastName: 'Snape',
      osuId: '000000000',
      onid: 'antihero',
      osuUid: '9999999999',
      proxId: '1111-2222222',
    },
  ],
];

const fakeIdentityTestCases = [
  {
    firstName: 'Albus',
    middleName: null,
    lastName: 'Dumbledore',
    osuId: '111111111',
    onid: 'wizard',
    osuUid: '1111111111',
    proxId: '0000-3333333',
  },
];

module.exports = {
  fakeIdentityTestCases,
  fakeIdentitiesTestCases,
};
