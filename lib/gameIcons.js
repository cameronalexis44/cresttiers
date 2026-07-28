// Small original pixel-art-styled icons for each gamemode tab.
// These are stylized originals (not Minecraft's actual textures/art assets).
export default function GameIcon({ type, size = 20 }) {
  const props = { width: size, height: size, viewBox: "0 0 16 16", xmlns: "http://www.w3.org/2000/svg" };

  switch (type) {
    case "overall":
      return (
        <svg {...props}>
          <path fill="#e8b923" d="M3 2h10v2h1v2l-2 2v1H4V8L2 6V4h1V2z" />
          <path fill="#b8890f" d="M6 9h4v2H6z" />
          <path fill="#8a6205" d="M5 11h6v1H5z" />
        </svg>
      );
    case "ltm":
      return (
        <svg {...props}>
          <path fill="#c9cad0" d="M2 2l5 5-1 1-5-5z" />
          <path fill="#8b8f96" d="M6 6l1 1-4 4-1-1z" />
          <path fill="#c9cad0" d="M14 2L9 7l1 1 5-5z" />
          <path fill="#8b8f96" d="M10 6L9 7l4 4 1-1z" />
          <path fill="#5fd9e0" d="M7 8h2v2H7z" />
        </svg>
      );
    case "vanilla":
      return (
        <svg {...props}>
          <path fill="#7cb342" d="M2 2h12v4H2z" />
          <path fill="#6b9c3a" d="M2 2h3v4H2zM11 2h3v4h-3z" />
          <path fill="#8a5a2b" d="M2 6h12v8H2z" />
          <path fill="#734b23" d="M2 6h3v8H2zM11 6h3v8h-3z" />
        </svg>
      );
    case "uhc":
      return (
        <svg {...props}>
          <path fill="#e8b923" d="M4 5h8v6H4z" />
          <path fill="#c9990f" d="M4 5h2v6H4zM10 5h2v6h-2z" />
          <path fill="#6b9c3a" d="M8 2l2 2H6z" />
        </svg>
      );
    case "pot":
      return (
        <svg {...props}>
          <path fill="#7fd936" d="M6 2h4v2H6z" />
          <path fill="#3fae2e" d="M6 4h4v2H6z" />
          <path fill="#c9cad0" d="M5 6h6v7H5z" />
          <path fill="#a3aab5" d="M5 6h1v7H5zM10 6h1v7h-1z" />
        </svg>
      );
    case "nethop":
      return (
        <svg {...props}>
          <path fill="#c1503a" d="M5 2h6l2 4-5 8-5-8z" />
          <path fill="#e07a5f" d="M6 3h4l1.5 3-3.5 6-3.5-6z" />
        </svg>
      );
    case "smp":
      return (
        <svg {...props}>
          <path fill="#a3742f" d="M2 5h12v7H2z" />
          <path fill="#8a5f24" d="M2 5h12v2H2z" />
          <path fill="#e8b923" d="M7 7h2v2H7z" />
        </svg>
      );
    case "sword":
      return (
        <svg {...props}>
          <path fill="#c9cad0" d="M9 2l3 3-6 6-2-2z" />
          <path fill="#8b8f96" d="M9 2l1 1-7 7-1-1z" />
          <path fill="#734b23" d="M4 10l2 2-1 2-2-1z" />
          <path fill="#e8b923" d="M3 12l1 1-1 1-1-1z" />
        </svg>
      );
    case "axe":
      return (
        <svg {...props}>
          <path fill="#c9cad0" d="M8 2c2 0 4 2 4 4-1 1-3 1-4 0-1 1-3 1-4 0 0-2 2-4 4-4z" />
          <path fill="#734b23" d="M7 6h2v8H7z" />
        </svg>
      );
    case "mace":
      return (
        <svg {...props}>
          <path fill="#6b6e78" d="M5 2h6v6H5z" />
          <path fill="#4d5057" d="M5 2h6v2H5zM5 6h6v2H5z" />
          <path fill="#734b23" d="M7 8h2v6H7z" />
        </svg>
      );
    default:
      return null;
  }
}
