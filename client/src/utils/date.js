
import { format, formatRelative } from 'date-fns';

export const formatDate = (date, formatStr = 'PPP') => { 
    if (!date) {
      return 'N/A';
    }

    try {
        return format(date, formatStr);
    }
    catch(error){
        console.error("Date formatting error", error);
        return 'Invalid Date';
    }

};

export const formatRelativeDate = (date) => {
  if (!date) {
    return 'N/A';
  }
  try{
    return formatRelative(date, new Date());
  }
  catch(error){
     console.error("Date formatting error", error);
    return 'Invalid Date';
  }

};