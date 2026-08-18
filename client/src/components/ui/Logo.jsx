/**
 * Logo SVG de Somos Casa Iglesia
 * Recreado como componente React SVG basado en el diseño circular original:
 * - Fondo circular negro
 * - Ícono de casa/iglesia arriba
 * - Texto "somos CASA iglesia"
 */

export default function Logo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo Somos Casa Iglesia"
    >
      {/* Fondo circular */}
      <circle cx="100" cy="100" r="98" fill="#1a1a1a" stroke="#333" strokeWidth="2" />

      {/* Ícono de casa/iglesia */}
      <g transform="translate(100, 52)">
        {/* Techo / líneas de la casa */}
        <line x1="-20" y1="20" x2="0" y2="0" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="20" y1="20" x2="0" y2="0" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
        {/* Paredes verticales */}
        <line x1="-15" y1="20" x2="-15" y2="38" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="15" y1="20" x2="15" y2="38" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
        {/* Línea central (puerta/cruz) */}
        <line x1="0" y1="20" x2="0" y2="38" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
        {/* Base */}
        <line x1="-15" y1="38" x2="15" y2="38" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Texto "somos" */}
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fill="white"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="22"
        fontWeight="400"
        letterSpacing="3"
      >
        somos
      </text>

      {/* Texto "CASA" */}
      <text
        x="100"
        y="148"
        textAnchor="middle"
        fill="white"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="36"
        fontWeight="800"
        letterSpacing="5"
      >
        CASA
      </text>

      {/* Texto "iglesia" */}
      <text
        x="100"
        y="172"
        textAnchor="middle"
        fill="white"
        fontFamily="Georgia, serif"
        fontSize="18"
        fontStyle="italic"
        fontWeight="400"
        letterSpacing="1"
      >
        iglesia
      </text>
    </svg>
  );
}
