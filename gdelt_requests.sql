SELECT GLOBALEVENTID, SQLDATE, numMentions, numSources, numArticles, AvgTone, SOURCEURL from [gdelt-bq:gdeltv2.events] where SQLDATE>20181101;
