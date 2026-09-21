-- Run once in Supabase SQL Editor to update the existing live CMS row.
update public.properties
set title = 'Darul Qarar',
    location = 'East Banasree',
    image_url = '/nexus-landmark-project.jpg'
where title = 'Darul Qarar'
   or title = 'Darul Qarar ';
