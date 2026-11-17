import { useLanguage } from "../contexts/languageContext";
import { translate } from "../utils/localization";

function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}) {
  const language = useLanguage();

  return (
    <div className="section-header">
      <div className="section-header-content">
        <h2>{translate(language, title)}</h2>

        {subtitle && (
          <p>{translate(language, subtitle)}</p>
        )}
      </div>

      {actionLabel && (
        <button
          className="section-header-action"
          onClick={onAction}
        >
          {translate(language, actionLabel)}
        </button>
      )}
    </div>
  );
}

export default SectionHeader;