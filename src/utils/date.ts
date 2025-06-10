import {
  format,
  formatDistanceToNow,
  isSameYear,
  isToday as isTodayFns,
  isYesterday as isYesterdayFns,
  parseISO,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期时间
 * @param dateString 日期字符串
 * @param formatStr 格式化字符串，默认为 'yyyy-MM-dd HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  dateString: string | Date,
  formatStr: string = 'yyyy-MM-dd HH:mm:ss',
): string => {
  if (!dateString) return '';
  try {
    const date =
      typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

/**
 * 格式化为相对时间
 * @param dateString 日期字符串
 * @returns 相对时间字符串，如 "2小时前"
 */
export const formatRelativeTime = (dateString: string | Date): string => {
  if (!dateString) return '';
  try {
    const date =
      typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '';
  }
};

/**
 * 格式化为简短日期
 * @param dateString 日期字符串
 * @returns 简短日期字符串，如 "12-25"
 */
export const formatShortDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  return formatDate(dateString, 'MM-dd');
};

/**
 * 格式化为年月日
 * @param dateString 日期字符串
 * @returns 年月日字符串，如 "2023年12月25日"
 */
export const formatDateCN = (dateString: string | Date): string => {
  if (!dateString) return '';
  return formatDate(dateString, 'yyyy年MM月dd日');
};

/**
 * 判断是否为今天
 * @param dateString 日期字符串
 * @returns 是否为今天
 */
export const isToday = (dateString: string | Date): boolean => {
  if (!dateString) return false;
  try {
    const date =
      typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return isTodayFns(date);
  } catch (error) {
    console.error('Date comparison error:', error);
    return false;
  }
};

/**
 * 判断是否为昨天
 * @param dateString 日期字符串
 * @returns 是否为昨天
 */
export const isYesterday = (dateString: string | Date): boolean => {
  if (!dateString) return false;
  try {
    const date =
      typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return isYesterdayFns(date);
  } catch (error) {
    console.error('Date comparison error:', error);
    return false;
  }
};

/**
 * 智能格式化日期
 * 今天显示时间，昨天显示"昨天"，其他显示日期
 * @param dateString 日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatSmartDate = (dateString: string | Date): string => {
  if (!dateString) return '';

  try {
    const date =
      typeof dateString === 'string' ? parseISO(dateString) : dateString;

    if (isTodayFns(date)) {
      return format(date, 'HH:mm');
    }

    if (isYesterdayFns(date)) {
      return '昨天';
    }

    if (isSameYear(date, new Date())) {
      return format(date, 'MM-dd');
    }

    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Smart date formatting error:', error);
    return '';
  }
};
