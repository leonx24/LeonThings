const colors = [
  {
    name: "Amber",
    value: "251 191 36",
  },
  {
    name: "Cyan",
    value: "34 211 238",
  },
  {
    name: "Purple",
    value: "168 85 247",
  },
  {
    name: "Red",
    value: "248 113 113",
  },
  {
    name: "Emerald",
    value: "52 211 153",
  },
];

const ThemeSwitcher = () => {
  const changeTheme = (color) => {
    document.documentElement.style.setProperty(
      "--primary",
      color
    );
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3">

      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => changeTheme(color.value)}
          className="w-5 h-5 rounded-full border border-white/20 hover:scale-125 transition-transform duration-300"
          style={{
            background: `rgb(${color.value})`,
          }}
        />
      ))}

    </div>
  );
};

export default ThemeSwitcher;