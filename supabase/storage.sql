-- 创建存储桶（如果不存在）
insert into storage.buckets (id, name, public)
values ('blog-uploads', 'blog-uploads', true)
on conflict (id) do nothing;

-- 配置存储桶策略
create policy "Authenticated users can upload files"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'blog-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- 允许所有人查看文件
create policy "Anyone can view files"
on storage.objects
for select
to public
using (bucket_id = 'blog-uploads');

-- 允许上传者删除自己的文件
create policy "Users can delete their own files"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'blog-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- 允许上传者更新自己的文件
create policy "Users can update their own files"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'blog-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
); 