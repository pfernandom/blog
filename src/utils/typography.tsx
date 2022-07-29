import Typography from "typography";
import Wordpress2016 from "typography-theme-wordpress-2016";

Wordpress2016.overrideThemeStyles = () => {
  return {
    a: {
      boxShadow: `none`,
    },
  };
};

delete Wordpress2016.googleFonts;

const t = Object.assign({}, Wordpress2016, {
  headerWeight: 500,
  headerFontFamily: [
    "Helvetica Neue",
    "Segoe UI",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
  bodyFontFamily: [
    "Avenir Next",
    "Helvetica Neue",
    "Segoe UI",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
});

const typography = new Typography(t);

typography.injectStyles();
export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
