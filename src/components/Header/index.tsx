import { ArrowLeft } from "lucide-react"

import brandLogo from "@/assets/Brand-logo.png"
import refreshIcon from "@/assets/Refresh.svg"
import { Button } from "@/components/ui/button"

import styles from "./style.module.css"
import type { HeaderProps } from "./types"

export const Header = ({
  canGoBack,
  isRefreshing,
  onBackClick,
  onRefreshClick,
}: HeaderProps) => {
  return (
    <header className={`logo-header ${styles.topBar}`}>
      <div className={styles.headerActionWrapper}>
        {canGoBack ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBackClick}
            className={`back-button-anim ${styles.backButton}`}
            aria-label="Back to previous screen"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-11" />
        )}
      </div>

      <img
        src={brandLogo}
        alt="Juicebox"
        className="h-7 w-auto object-contain select-none"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRefreshClick}
        disabled={isRefreshing}
        className={`refresh-btn ${styles.refreshButton}`}
        aria-label="Refresh industry thoughts"
      >
        <img
          src={refreshIcon}
          alt="Refresh"
          className="refresh-icon h-5 w-5 select-none"
        />
      </Button>
    </header>
  )
}

export default Header
