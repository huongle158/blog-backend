export const diskStoConfig = {
  destination: './public/avatars',
  filename: (_, file, cb) => {
    const filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  },
};

export const diskBannerConfig = {
  destination: './public/banners',
  filename: (_, file, cb) => {
    const filename = `bn_${Date.now()}_${file.originalname}`;
    cb(null, filename);
  },
};
