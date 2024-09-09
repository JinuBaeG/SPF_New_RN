export function dateTime(date: Date) {
  const currentTime = new Date().getTime();
  const updateTime = new Date(date).getTime();
  const timeDiff = currentTime - updateTime;
  const timeDiffSec = Math.floor(timeDiff / 1000);
  const timeDiffMin = Math.floor(timeDiffSec / 60);
  const timeDiffHour = Math.floor(timeDiffMin / 60);
  const timeDiffDay = Math.floor(timeDiffHour / 24);
  const updateYear = date.getFullYear();
  const updateMon = date.getMonth() + 1;
  const updateDay = date.getDate();

  if (timeDiffSec < 60) {
    return "방금 전";
  } else if (timeDiffMin < 60) {
    return timeDiffMin + "분 전";
  } else if (timeDiffHour < 24) {
    return timeDiffHour + "시간 전";
  } else if (timeDiffDay > 0) {
    return updateYear + "년 " + updateMon + "월 " + updateDay + "일";
  }
}
