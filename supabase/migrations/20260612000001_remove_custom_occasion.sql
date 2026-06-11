-- Remove 'custom' from the appointments occasion check constraint

alter table appointments drop constraint if exists appointments_occasion_check;

alter table appointments
  add constraint appointments_occasion_check
  check (occasion in ('office', 'festive', 'everyday'));
