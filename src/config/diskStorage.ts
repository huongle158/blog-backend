export const diskStoConfig = {
  destination: './public/avatars',
  filename: (_, file, cb) => {
    const filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  },
};
